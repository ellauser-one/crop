"use client";
import { photos } from '@/src/app/data';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';

export default function pageClient() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id;
    const photo = photos.find(p => String(p.id) === String(id));

    if (!photo) {
        // client-side: just go back or render nothing
        return null;
    }

    return (
        <div className='flex justify-center items-center fixed inset-0 bg-gray-500/80' onClick={() => router.back()}>
            <Image src={photo.src} width={300} height={300} alt={photo.alt} className='rounded-lg' onClick={e => e.stopPropagation()} />
        </div>
    );
}
