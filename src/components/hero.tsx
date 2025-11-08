import Image, { StaticImageData } from 'next/image'

interface IProps {
  imgUrl: StaticImageData;
  altText: string;
  content: string;
}

export default function hero(props: IProps) {
  return (
     <div className='h-screen text-yellow-300 relative'>
      <div className='absolute inset-0 -z-10'>
        <Image  src={props.imgUrl} alt={props.altText} fill style={{objectFit:'cover'}} />
        <div className='absolute inset-0 bg-linear-to-r from-blue-100'></div>
      </div>
      <div className='flex justify-center pt-48'>
        <h1 className='text-white text-6xl'>{props.content}</h1>
      </div>
    </div>
  )
}
