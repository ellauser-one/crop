import { photos } from '@/src/app/data';
import { notFound } from 'next/navigation';
import Image from 'next/image';


interface IParams {
    params: {
        id?: string;
    } | Promise<{
        id?: string;
    }>;
}
export default async function page({ params }: IParams) { 
    const resolved = await params;
    const photo = photos.find(p => p.id === resolved.id)!;
    if (!photo) {
        notFound();
    }
    return (
        <div className='container mx-auto pt-8'>
            <Image src={photo.src} width={300} height={300} alt={photo.alt} className='rounded-lg block mx-auto' />

            <div className='border-2 border-dashed border-gray-500 rounded-lg p-3 mt-6 leading-8'>
                <p>
                    <strong>Title:</strong> {photo.alt}
                </p>
                <p>
                    <strong>Price:</strong> {photo.price}
                </p>
                <p>
                    <strong>Desc:</strong> Cillum pariatur id cupidatat dolore enim ea ipsum culpa. Irure veniam velit adipisicing consectetur eu labore pariatur ut. Laborum in nisi amet aute dolore do Irure mollit dolor ut excepteur sint. Voluptate duis est dolore velit velit irure laboris cillum eiusmod occaecat. Aliqua veniam esse fugiat nostrud nisi excepteur esse. Eu in dolore in occaecat elit dolore adipisicing vejiam. Occaecat eiusmod reprehenderit ex eu nulla eiusmod adipisicing aliquip anim fugiat adipisicing ut sit consequat. Lorem anim amet nostrud sint aute consequat non. Nisi officia non dolor aute excepteur proident aute est eu veniam minim amet irure. lncididunt aute minim incididunt nulla fugiat do nisi consequat sint ut reprehenderit eiusmod duis. Eu dolor minim irure et magna do id voluptate eiusmod enim. Elit quis officia officia enim tempor fugiat ea velit ut proident in exercitation. Ad culpa sint eiusmod nostrud labore tempor tempor id aliqua aliqua. Aliqua tempor dolore occaecat dolore laboris incididunt culpa ea incididunt in. Dolor et incididunt duis ullamco ad exercitation enim non. Enim do dolore quis aute anim voluptate aliquip dolor cupidatat occaecat nostrud deseruntminim
                </p>
            </div>
        </div>
    )
}
