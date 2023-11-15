import favoriteApi from '@/apis/modules/favorite.api'
import productApi from '@/apis/modules/product.api'
import DetailImage from '@/components/DetailImage'
import ProductDescription from '@/components/ProductDescription'
import ProductInfo from '@/components/ProductInfo'
import ReviewList from '@/components/ReviewList'
import ShopPreview from '@/components/ShopPreview'
import { Button } from '@/components/ui/button'
import { setGlobalLoading } from '@/redux/features/globalLoadingSlice'
import { addFavorite, removeFavorite } from '@/redux/features/userSlice'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { MdOutlineFavorite, MdOutlineFavoriteBorder } from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom'

const ProductDetail = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { productId } = useParams()
  const [product, setProduct] = useState(null)
  const { listFavorites, user, listCarts } = useSelector(state => state.user)
  const [isFavorite, setIsFavorite] = useState(false)
  const [onRequest, setOnRequest] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [reviewCount, setReviewCount] = useState(0)
  const [favoriteCount, setFavoriteCount] = useState(0)
  const [reviews, setReviews] = useState([])
  const [starCount, setStarCount] = useState([])

  useEffect(() => {
    const getProduct = async () => {
      dispatch(setGlobalLoading(true))
      const { response, err } = await productApi.getDetail({
        productId,
      })
      dispatch(setGlobalLoading(false))

      if (response) {
        setProduct(response)
        setIsFavorite(response.isFavorite)
        setReviews(response.reviews)
      }

      if (err) toast.error(err.message)
    }

    getProduct()
  }, [dispatch])

  useEffect(() => {
    const getImage = async () => {
      if (product && product.imageName) {
        const { response, err } = await productApi.getImage({
          imageName: product.imageName,
        })

        if (err) toast.error(err.message)
        if (response) {
          setImageUrl(`data:image/png;base64,${response}`)
        }
      }
    }

    getImage()
  }, [product])

  useEffect(() => {
    if (product && product.reviews) {
      let starCount = Array(6).fill(0)
      product.reviews.forEach(review => {
        starCount[review.rating]++
      })
      setStarCount(starCount)
    }
  }, [product])

  const onFavoriteClick = async () => {
    if (!user) {
      toast.error('You must login first!', { toastId: 'warning-login' })
      navigate('/auth/signin')
      return
    }
    if (onRequest) return
    if (isFavorite) {
      onRemoveFavorite()
      return
    }

    setOnRequest(true)

    const body = {
      productId: product._id,
    }
    const { response, err } = await favoriteApi.add(body)
    if (err) toast.error(err.message)

    setOnRequest(false)

    if (response) {
      dispatch(
        addFavorite({
          ...response,
          productId: { ...product },
        })
      )
      setIsFavorite(true)
      toast.success('Add favorite success')
      setFavoriteCount(favoriteCount + 1)
    }
  }

  const onRemoveFavorite = async () => {
    if (onRequest) return

    setOnRequest(true)
    const favorite = listFavorites.find(
      item => item.productId._id === product._id
    )

    const { response, err } = await favoriteApi.remove({
      favoriteId: favorite.id,
    })

    setOnRequest(false)

    if (err) toast.error(err.message)

    if (response) {
      dispatch(removeFavorite({ favoriteId: favorite.id }))
      setIsFavorite(false)
      setFavoriteCount(favoriteCount - 1)
    }
  }

  useEffect(() => {
    if (product && product.favorites) {
      setFavoriteCount(product.favorites.length)
    }
  }, [product])

  return (
    <div className="bg-bg_page  h-full space-y-6 px-0 py-0 sm:py-[56px]   xl:px-[136px]">
      <div className="mx-auto h-full max-w-[1220px] space-y-6 bg-accent">
        <div className="h-full w-full  rounded-md bg-white">
          <div className="flex flex-col gap-x-6  bg-accent md:flex-row">
            <div className=" flex flex-[20%] flex-col gap-y-6 bg-accent lg:flex-[33%]">
              <div className="w-full  rounded-md bg-white p-4">
                <div
                  className="aspect-square  w-full rounded-md border  border-accent bg-cover bg-center lg:min-w-[450px]"
                  style={{
                    backgroundImage: `url(${imageUrl})`,
                  }}
                ></div>

                <div className="hidden flex-wrap   items-center  justify-center gap-y-2 bg-white p-2 md:flex">
                  <h3 className="text-base">Chia sẻ:</h3>
                  <div className="border-right-ab relative ml-4 flex gap-4 text-2xl after:right-[-2rem]">
                    <button className="text-[#0384ff]">
                      <i className="fa-brands fa-facebook-messenger"></i>
                    </button>
                    <button className="text-[#3b5999]">
                      <i className="fa-brands fa-facebook"></i>
                    </button>
                    <button className="text-[#de0217]">
                      <i className="fa-brands fa-pinterest"></i>
                    </button>
                    <button className="text-[#10c2ff]">
                      <i className="fa-brands fa-twitter"></i>
                    </button>
                  </div>

                  <div
                    className="flex cursor-pointer select-none items-center capitalize"
                    onClick={onFavoriteClick}
                  >
                    {!isFavorite ? (
                      <MdOutlineFavoriteBorder
                        className="ml-[4rem] mr-3 text-2xl text-red-600"
                        onClick={() => setIsFavorite(!isFavorite)}
                      />
                    ) : (
                      <MdOutlineFavorite
                        className="ml-[4rem] mr-3 text-2xl text-red-600"
                        onClick={() => setIsFavorite(!isFavorite)}
                      />
                    )}
                    <span className="text-base">
                      đã thích ({favoriteCount})
                    </span>
                  </div>
                </div>

                {/* <div className="scrollbar-hide hidden max-w-[100%] gap-4 overflow-x-scroll md:flex">
                  <DetailImage />
                  <DetailImage />
                  <DetailImage />
                  <DetailImage />
                </div> */}
              </div>
              <ShopPreview product={product} />
            </div>
            <div className="flex-[80%] rounded-md bg-white p-4 lg:flex-[66%]">
              <ProductInfo
                product={product}
                reviewCount={reviewCount}
                onFavoriteClick={onFavoriteClick}
                favoriteCount={favoriteCount}
                isFavorite={isFavorite}
                setIsFavorite={setIsFavorite}
              />
            </div>
          </div>
        </div>

        <div className="flex h-full w-full  gap-x-6  rounded-md bg-accent ">
          <div className="flex-[80%]  space-y-6  bg-accent">
            <ProductDescription product={product} />

            <ReviewList
              reviews={reviews ?? []}
              setReviews={setReviews}
              product={product}
              setReviewCount={setReviewCount}
              starCount={starCount}
            />
          </div>
          <div className=" hidden h-full  flex-[20%] rounded-md bg-white px-6 py-8 md:block">
            <span className="w-[120px] text-sm text-gray-500 ">
              Mã giảm giá của shop
            </span>

            {Array(3)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="px-2 py-4">
                  <span className="flex flex-wrap items-center justify-center gap-4 rounded-sm bg-[#fafafa] px-2 py-4">
                    <div>
                      <div className="mb-4 font-medium capitalize text-primary">
                        <div className="text-center text-sm">giảm 10%</div>
                        <div className="text-xs">đơn tối thiểu 69k</div>
                      </div>

                      <div className="text-sm text-gray-500">
                        HSD 04.06.2023
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Button className="px-6" size="sm">
                        Lưu
                      </Button>
                    </div>
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
