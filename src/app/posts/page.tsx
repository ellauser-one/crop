'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

type Article = {
    id: string;
    title: string;
    content: string;
};

export default function ArticlesPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // 使用后端约定的 pageNum 查询参数
    const pageNum = Number(searchParams.get('pageNum') || 1);

    const [list, setList] = useState<Article[]>([]);
    const [total, setTotal] = useState(0);
    const [q, setQ] = useState('');
    const pageSize = 5;

    /* 兼容后端各种返回格式，提取列表与总数 */
    const normalize = (json: any) => {
        // 优先支持 { list, total }
        if (json?.list && typeof json.list === 'object') {
            return { list: json.list, total: json.total ?? json.count ?? json.list.length };
        }
        // 支持 { data: { list, total } }
        if (json?.data && json.data.list && Array.isArray(json.data.list)) {
            return { list: json.data.list, total: json.data.total ?? json.data.count ?? json.data.list.length };
        }
        // 支持 { data: [...] } 或 { data: { posts: [...] } }
        if (Array.isArray(json?.data)) return { list: json.data, total: json.data.length };
        if (Array.isArray(json?.data?.posts)) return { list: json.data.posts, total: json.data.total ?? json.data.posts.length };
        // 支持直接数组
        if (Array.isArray(json)) return { list: json, total: json.length };
        return { list: [], total: 0 };
    };

    /* 获取数据，使用 AbortController 取消前一次请求以避免重复，并对相同请求做去重（防止 Strict Mode 双次 mount） */
    const currentController = useRef<AbortController | null>(null);
    const inFlight = useRef<Record<string, boolean>>({});

    const fetchData = async (p = pageNum) => {
        const key = `${p}::${q}`;
        // 如果同一请求已经在进行中，直接跳过
        if (inFlight.current[key]) return;
        inFlight.current[key] = true;

        // cancel previous controller (different page or previous run)
        if (currentController.current) currentController.current.abort();
        const controller = new AbortController();
        currentController.current = controller;

        const url = new URL(`/api/articles`, location.origin);
        url.searchParams.set('pageNum', String(p));
        url.searchParams.set('pageSize', String(pageSize));
        if (q) url.searchParams.set('q', q);

        try {
            const res = await fetch(url.toString(), { signal: controller.signal });
            const json = await res.json();
            const { list: fetchedList, total: fetchedTotal } = normalize(json);
            // 确保 id 为字符串
            setList(fetchedList.map((it: any) => ({ ...it, id: String(it.id) })));
            setTotal(Number(fetchedTotal ?? 0));
        } catch (e: any) {
            if (e?.name === 'AbortError') return; // 预期的取消
            console.error('fetchData error', e);
        } finally {
            // clear if same controller
            if (currentController.current === controller) currentController.current = null;
            // clear in-flight marker
            delete inFlight.current[key];
        }
    };

    useEffect(() => {
        fetchData(pageNum);
        return () => {
            if (currentController.current) currentController.current.abort();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageNum, q]);

    /* 按钮回调 */
    const handleSearch = () => {
        // 跳到第一页并由 useEffect 触发 fetch
        router.push(`/articles?pageNum=1`);
    };
    const handleReset = () => {
        setQ('');
        router.push(`/articles?pageNum=1`);
    };
    const handleAdd = () => router.push('/articles/new');

    /* 行内操作 */
    const handleEdit = (id: string) => router.push(`/articles/${id}/edit`);
    const handleDelete = async (id: string) => {
        if (!confirm('确定删除？')) return;
        await fetch(`/api/articles/${id}`, { method: 'DELETE' });
        fetchData(pageNum); // 刷新当前页
    };

    /* 分页按钮 */
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const goPage = (p: number) => router.push(`/articles?pageNum=${p}`);

    const pagesToShow = useMemo(() => {
        const arr: number[] = [];
        const max = 10;
        let start = Math.max(1, pageNum - Math.floor(max / 2));
        let end = start + max - 1;
        if (end > totalPages) {
            end = totalPages;
            start = Math.max(1, end - max + 1);
        }
        for (let i = start; i <= end; i++) arr.push(i);
        return arr;
    }, [pageNum, totalPages]);

    return (
        <div style={{ padding: 24 }}>
            {/* 顶部搜索和添加 */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <input
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder="搜索标题/内容"
                        style={{ padding: '6px 8px', minWidth: 240 }}
                    />
                    <button onClick={handleSearch}>搜索</button>
                    <button onClick={handleReset}>重置</button>
                </div>
                <div style={{ marginLeft: 'auto' }}>
                    <button onClick={handleAdd}>添加</button>
                </div>
            </div>

            {/* 表格 */}
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ textAlign: 'left', borderBottom: '1px solid #eee' }}>
                        <th style={{ padding: '12px' }}>标题</th>
                        <th style={{ padding: '12px' }}>内容</th>
                        <th style={{ padding: '12px' }}>操作</th>
                    </tr>
                </thead>
                <tbody>
                    {list.length === 0 ? (
                        <tr>
                            <td colSpan={3} style={{ padding: 24, textAlign: 'center', color: '#888' }}>暂无数据</td>
                        </tr>
                    ) : (
                        list.map((v) => (
                            <tr key={v.id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                                <td style={{ padding: 12 }}>{v.title}</td>
                                <td style={{ padding: 12 }}>{v.content}</td>
                                <td style={{ padding: 12 }}>
                                    <a onClick={() => handleEdit(v.id)} style={{ marginRight: 12, cursor: 'pointer' }}>编辑</a>
                                    <a onClick={() => handleDelete(v.id)} style={{ cursor: 'pointer' }}>删除</a>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {/* 分页 */}
            <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>
                <button disabled={pageNum <= 1} onClick={() => goPage(pageNum - 1)}>‹</button>
                {pagesToShow.map((p) => (
                    <button
                        key={p}
                        onClick={() => goPage(p)}
                        style={{
                            padding: '6px 10px',
                            background: p === pageNum ? '#2d8cf0' : undefined,
                            color: p === pageNum ? '#fff' : undefined,
                            borderRadius: 4,
                            border: '1px solid #eee',
                            cursor: 'pointer'
                        }}
                    >
                        {p}
                    </button>
                ))}
                <button disabled={pageNum >= totalPages} onClick={() => goPage(pageNum + 1)}>›</button>
            </div>
        </div>
    );
}