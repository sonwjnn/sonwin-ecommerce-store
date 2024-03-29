import { Link } from 'react-router-dom'

const CategoryItem = ({ index, cate, disable }) => {
  return (
    <Link
      className={`cursor-pointer ${
        disable && 'cate-disable pointer-events-none select-none'
      } relative flex  h-[50%] items-center gap-x-2  rounded-md px-4  py-2 transition hover:bg-gray-100 active:bg-gray-200`}
      to={`/products/${cate?.slug}/all`}
    >
      <div
        className="min-h-[40px] min-w-[40px] self-start bg-contain bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${`/images/cates/cates_${index + 1}.png`})`,
        }}
      ></div>
      <div
        className={` line-clamp-2  flex items-center justify-center text-sm `}
        key={index}
      >
        {cate?.name}
      </div>
    </Link>
  )
}

export default CategoryItem
