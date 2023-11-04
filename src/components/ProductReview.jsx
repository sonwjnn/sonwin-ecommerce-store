import reviewApi from '@/apis/modules/review.api'
import dayjs from 'dayjs'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'react-hot-toast'
import { FiSend } from 'react-icons/fi'
import { MdDelete } from 'react-icons/md'
import { RiDeleteBin5Line } from 'react-icons/ri'
import { useSelector } from 'react-redux'

import LoadingButton from './LoadingButton'
import Star from './Star'
import StarVote from './StarVote'
import TextAvatar from './TextAvatar'

const ReviewItem = ({ review, onRemoved }) => {
  const { user } = useSelector(state => state.user)

  const [onRequest, setOnRequest] = useState(false)

  const onRemove = async () => {
    if (onRequest) return
    setOnRequest(true)

    const { response, err } = await reviewApi.remove({ reviewId: review._id })

    setOnRequest(false)
    if (err) toast.error(err.message)
    if (response) onRemoved(review._id)
  }

  return (
    <div className="relative mb-2 rounded-md p-2 hover:bg-bg_page">
      <div className="flex flex-row gap-4">
        {/* avatar */}
        <div className="h-[30px] w-[30px]">
          <TextAvatar text={review.user.name} />
        </div>
        {/* avatar */}

        <div className="flex grow flex-col justify-center gap-2">
          <div className="gap-1">
            <h6 className="text-base font-bold">{review.user.name}</h6>
            <Star stars={review.rating} />
            <p className="text-[11px] text-gray-500">
              {dayjs(review.createdAt).format('DD-MM-YYYY HH:mm:ss')}
            </p>
          </div>
          <div className=" flex flex-row justify-between gap-4">
            <div className="flex justify-center text-sm">{review.content}</div>
          </div>
          {user && user.id === review.user.id && (
            <LoadingButton
              loading={onRequest}
              colorLoading={'#fb5533'}
              variant={'contained'}
              className={`mr-2 flex items-center justify-center border-none bg-transparent px-3 py-2 text-[24px] text-red-600 sm:relative sm:right-0 md:absolute md:right-2`}
              onClick={onRemove}
            >
              <RiDeleteBin5Line />
            </LoadingButton>
          )}
        </div>
      </div>
    </div>
  )
}

const ProductReview = ({ reviews, product, reviewCount, setReviewCount }) => {
  const { user } = useSelector(state => state.user)

  const [listReviews, setListReviews] = useState([])
  const [filteredReviews, setFilteredReviews] = useState([])
  const [page, setPage] = useState(1)
  const [onRequest, setOnRequest] = useState(false)
  const [content, setContent] = useState('')
  const [rating, setRating] = useState(0)
  const reviewRef = useRef()

  const skip = 4

  useEffect(() => {
    setListReviews([...reviews])
    setFilteredReviews([...reviews].splice(0, skip))
    setReviewCount(reviews.length)
  }, [reviews])

  const onAddReview = async () => {
    if (onRequest) return
    const body = {
      productId: product._id,
      typeId: product.typeId._id,
      cateId: product.cateId._id,
      productName: product.name,
      productImage: product.imageName,
      rating,
      content,
    }
    if (!content.trim()) {
      reviewRef.current.focus()
      return toast.error('Please enter your review before submit!', {
        id: 'review toast',
      })
    }
    if (!rating) {
      return toast.error('Please select your vote before submit!', {
        id: 'vote toast',
      })
    }

    setOnRequest(true)
    const { response, err } = await reviewApi.add(body)
    setOnRequest(false)

    if (err) toast.error(err.message)
    if (response) {
      toast.success('Post review success')

      setFilteredReviews([...filteredReviews, response])
      setReviewCount(reviewCount + 1)
      setContent('')
      setRating(null)
    }
  }

  const onLoadMore = () => {
    setFilteredReviews([
      ...filteredReviews,
      ...[...listReviews].splice(page * skip, skip),
      ,
    ])
    setPage(page + 1)
  }

  const onRemoved = id => {
    if (listReviews.findIndex(e => e.id === id) !== -1) {
      const newListReviews = [...listReviews].filter(e => e.id !== id)
      setListReviews(newListReviews)
      setFilteredReviews([...newListReviews].splice(0, page * skip))
    } else {
      setFilteredReviews([...filteredReviews].filter(e => e.id !== id))
    }

    setReviewCount(reviewCount - 1)

    toast.success('Remove review success')
  }

  return (
    <>
      <div>
        <div className="mb-2 mt-4 gap-4">
          {filteredReviews.map(item => (
            <div key={item._id}>
              <ReviewItem review={item} onRemoved={onRemoved} />
            </div>
          ))}
          {filteredReviews.length < listReviews.length && (
            <button onClick={onLoadMore}>load more</button>
          )}
        </div>
        {user && (
          <>
            <div className="mt-2 flex flex-row gap-2">
              <div className="h-[40px] w-[40px]">
                <TextAvatar text={user.name} />
              </div>
              <div className="flex w-full flex-col gap-4">
                <h6 className="text-base font-bold">{user.name}</h6>
                <div className="flex gap-3">
                  <textarea
                    value={content}
                    ref={reviewRef}
                    onChange={e => setContent(e.target.value)}
                    rows={4}
                    placeholder="Write your review"
                    className="grow resize-none border border-gray-300 bg-white p-4 text-sm"
                  />

                  <LoadingButton
                    loading={onRequest}
                    colorLoading={'#ffffff'}
                    variant={'contained'}
                    className={` btn-primary flex h-[4rem] items-center justify-center px-12 py-2`}
                    onClick={onAddReview}
                  >
                    <FiSend className=" mt-1 text-[20px]" />
                  </LoadingButton>
                </div>

                <div className="flex gap-4">
                  <div className="text-sm text-gray-400">Your vote: </div>
                  <StarVote rating={rating} setRating={setRating} />
                  <div className="text-sm text-gray-500">{rating}/5</div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default ProductReview
