import reviewApi from '@/services/api/modules/review.api'
import { cn } from '@/utils/helpers'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'react-hot-toast'
import { BsFillSendFill } from 'react-icons/bs'
import { useSelector } from 'react-redux'

import ReviewItem from './ReviewItem'
import StarVote from './StarVote'
import { UserIcon } from './common/Icon'
import Star from './common/Star'
import { Spinner } from './common/spinner'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Skeleton } from './ui/skeleton'

const ReviewList = props => {
  const { reviews, setReviews, product, starCount } = props
  const { user } = useSelector(state => state.user)

  const [filteredReviews, setFilteredReviews] = useState([])
  const [page, setPage] = useState(1)
  const [onRequest, setOnRequest] = useState(false)
  const [content, setContent] = useState('')
  const [rating, setRating] = useState(0)
  const [activeReview, setActiveReview] = useState(0)
  const reviewRef = useRef()

  // const skip = 4

  useEffect(() => {
    if (reviews.length) {
      const newFilteredReviews = activeReview
        ? reviews.filter(review => +review.rating === activeReview)
        : reviews

      setFilteredReviews(newFilteredReviews)
    }
  }, [reviews, activeReview])

  const onAddReview = async () => {
    if (onRequest) return
    const body = {
      productId: product._id,
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

      setReviews([...reviews, response])
      setContent('')
      setRating(null)
    }
  }

  // const onLoadMore = () => {
  //   setFilteredReviews([
  //     ...filteredReviews,
  //     ...[...reviews].splice(page * skip, skip),
  //     ,
  //   ])
  //   setPage(page + 1)
  // }

  const onRemoved = id => {
    if (reviews.findIndex(e => e.id === id) !== -1) {
      const newReviews = [...reviews].filter(e => e.id !== id)
      setReviews(newReviews)
      // setFilteredReviews([...newReviews].splice(0, page * skip))
      setFilteredReviews([...newReviews])
    } else {
      setFilteredReviews([...filteredReviews].filter(e => e.id !== id))
    }

    toast.success('Remove review success')
  }

  return (
    <>
      <div className="rounded-md bg-white px-4 sm:p-10">
        {product ? (
          <div className="w-full rounded-md bg-[#fafafa] px-6 py-5 text-xl font-medium capitalize text-[#242424]">
            đánh giá sản phẩm
          </div>
        ) : (
          <Skeleton className="mb-6  h-[68px] w-full" />
        )}
        <div className="mt-8   gap-4 bg-white px-0 capitalize  md:px-6 ">
          {product ? (
            <div className="flex items-center gap-x-2">
              <span className="w-[120px] py-2 text-sm font-medium text-[#242424] md:w-[120px]">
                Tổng quan
              </span>
              <div className="flex items-center gap-x-2">
                <span className="text-[28px] font-bold text-primary">
                  {product?.rating}
                </span>

                <Star
                  stars={product?.rating}
                  className="text-2xl text-yellow-500"
                />
              </div>
            </div>
          ) : (
            <Skeleton className="h-[30px] w-full md:w-[300px]" />
          )}

          <div className="mt-4  hidden items-center justify-start   gap-3 border-b border-gray-200 pb-6 pt-3 md:flex">
            {product ? (
              <>
                <span className=" w-[120px] py-2 text-sm font-medium text-[#242424] ">
                  Bộ lọc
                </span>
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    variant="outline"
                    className={cn(
                      `border-accent capitalize text-accent-foreground`,
                      activeReview === 0 ? 'border-primary text-primary' : ''
                    )}
                    key={0}
                    onClick={() => setActiveReview(0)}
                  >
                    tất cả
                  </Button>
                  {starCount.map((star, index) => {
                    if (index > 0) {
                      return (
                        <Button
                          variant="outline"
                          className={cn(
                            `border-accent text-accent-foreground`,
                            activeReview === index
                              ? 'border-primary text-primary'
                              : ''
                          )}
                          key={index}
                          onClick={() => setActiveReview(index)}
                        >
                          {`${index} sao (${star})`}
                        </Button>
                      )
                    }
                  })}
                </div>
              </>
            ) : (
              <Skeleton className="h-[30px] w-full " />
            )}
          </div>
          <div>
            <div className="mb-2 mt-4 gap-4">
              {filteredReviews.length
                ? filteredReviews.map(item => (
                    <div key={item?._id || item?.id}>
                      <ReviewItem review={item} onRemoved={onRemoved} />
                    </div>
                  ))
                : null}
              {!product ? (
                <div className="flex flex-col gap-y-3">
                  {Array(3)
                    .fill(0)
                    .map((_, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="h-[40px] w-[40px]">
                          <Skeleton className="aspect-square h-full w-full rounded-full" />
                        </div>
                        {/* avatar */}

                        <div className="flex grow flex-col justify-center gap-2">
                          <div className="flex flex-col gap-1">
                            <Skeleton className="h-[20px] w-[200px]" />
                            <Skeleton className="h-[20px] w-[100px]" />
                            <Skeleton className="h-[20px] w-[100px]" />
                          </div>
                          <Skeleton className="h-[80px] w-full" />
                        </div>
                      </div>
                    ))}
                </div>
              ) : null}
              {/* {filteredReviews.length < reviews.length && (
                <button onClick={onLoadMore}>load more</button>
              )} */}
            </div>
            {product && user && (
              <>
                <div className="mt-4 flex flex-row gap-2">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user?.imageUrl} />
                    <AvatarFallback>
                      <UserIcon />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex w-full flex-col gap-4">
                    <h6 className="text-base font-medium">{user.name}</h6>
                    <div className="flex gap-3">
                      <textarea
                        value={content}
                        ref={reviewRef}
                        onChange={e => setContent(e.target.value)}
                        rows={4}
                        placeholder="Nhập đánh giá của bạn..."
                        className="flex w-full grow resize-none rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring  disabled:cursor-not-allowed disabled:opacity-50"
                      />

                      <Button
                        className="px-6"
                        disable={onRequest}
                        onClick={onAddReview}
                      >
                        {onRequest ? <Spinner /> : <BsFillSendFill size={16} />}
                      </Button>
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
        </div>
      </div>
    </>
  )
}

export default ReviewList
