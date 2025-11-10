import React, { Suspense } from 'react';
import ArticlesClient from './ArticlesClient';

export default function Page() {
    return (
        <Suspense fallback={<div>加载中...</div>}>
            {/* client component handles useSearchParams / router */}
            <ArticlesClient />
        </Suspense>
    );
}