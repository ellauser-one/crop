import { Card } from 'antd';
import { data } from '../../../data';
import { notFound } from 'next/navigation';

interface IParams {
    params: {
        id?: string;
    } | Promise<{
        id?: string;
    }>;
}

export async function generateMetadata({ params }: IParams) {
    const resolved = await params;
    return {
        title: `博客详情 - ${resolved?.id}`,
    };
}

export default async function BlogPage({ params }: IParams) {
    // server-side log to help debug params
    // will appear in the terminal running `next dev`
    // eslint-disable-next-line no-console
    const resolved = await params;
    console.log('BlogPage server params ->', resolved);

    const id = resolved?.id ? parseInt(resolved.id as string, 10) : NaN;
    const item = data.find(d => Number(d.id) === id);
    if (!item) {
        notFound();
    }

    return (
        <Card title={item.title}>
            <p>{item.body}</p>
        </Card>
    );
}
