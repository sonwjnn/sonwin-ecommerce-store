import favoriteApi from '@/apis/modules/favorite.api'
import productApi from '@/apis/modules/product.api'
import { removeFavorite } from '@/redux/features/userSlice'
import { formatPriceToVND } from '@/utilities/constants'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { LuTrash } from 'react-icons/lu'
import { SlEmotsmile } from 'react-icons/sl'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import NotFound from './NotFound'
import { Spinner } from './Spinner'
import { Button } from './ui/button'

const FavoriteItem = props => {
  const { title, productImage, type, id, price, onRemoved, productId } = props

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [onRequest, setOnRequest] = useState(false)

  const onRemove = async () => {
    if (onRequest) return
    setOnRequest(true)

    const { response, err } = await favoriteApi.remove({
      favoriteId: id,
    })
    setOnRequest(false)

    if (err) toast.error(err.message)
    if (response) {
      dispatch(removeFavorite({ favoriteId: id }))
      onRemoved({ id })
      toast.success('Remove favorite success!')
    }
  }

  return (
    <div className="w-full px-4 pb-0 pt-0">
      <div className="grid min-h-[56px] grid-cols-favorite-3  items-center  border-b border-b-gray-200  p-1 ">
        <div
          onClick={() => navigate(`/products/detail/${productId}`)}
          className="group flex  cursor-pointer items-center gap-x-2"
        >
          <div
            className="aspect-square h-[56px] min-w-[56px] bg-cover bg-center bg-no-repeat "
            style={{
              backgroundImage: `url(${productImage})`,
            }}
          ></div>
          <div className="flex flex-col justify-center self-center">
            <div className="line-clamp-2 text-sm text-gray-500 group-hover:underline">
              {title}
            </div>
            {/* <div className="text-sm">{type}</div> */}
          </div>
        </div>

        <div className="text-center  text-lg text-primary md:text-base">
          {formatPriceToVND(price)}
        </div>

        <Button
          className="mx-auto border-none"
          variant="outline"
          size="icon"
          disable={onRequest}
          onClick={onRemove}
        >
          {onRequest ? (
            <Spinner className="text-primary" />
          ) : (
            <LuTrash className="text-secondary" size={20} />
          )}
        </Button>
      </div>
    </div>
  )
}

const FavoriteList = () => {
  const dispatch = useDispatch()
  const [favs, setFavs] = useState([])
  const [isCheckedAll, setCheckedAll] = useState(false)
  const [checkedFavs, setCheckedFavs] = useState([])
  const { listFavorites } = useSelector(state => state.user)

  useEffect(() => {
    setFavs([...listFavorites])
  }, [listFavorites])

  const onRemoved = ({ id, ids }) => {
    if (id) {
      const newFavs = [...favs].filter(e => e._id !== id)
      setFavs(newFavs)
    } else if (ids) {
      const newFavs = [...favs].filter(e => !ids.includes(e._id))
      setFavs(newFavs)
    }
  }

  useEffect(() => {
    if (isCheckedAll) {
      setCheckedFavs(favs.map(fav => fav._id))
    } else {
      setCheckedFavs([])
    }
  }, [isCheckedAll])

  const handleCheckedFav = ({ id, currPrice, isFavorValue }, isChecked) => {
    if (isFavorValue) {
      let checkedFavChange = checkedFavs.find(item => item.id === id)
      if (checkedFavChange) {
        checkedFavChange.currPrice = currPrice
        let newCheckedFavs = checkedFavs.slice()

        setCheckedFavs(newCheckedFavs)
      }
      return
    }
    if (isChecked) {
      setCheckedFavs([...checkedFavs, { id, currPrice }])
    } else {
      setCheckedFavs(checkedFavs.filter(item => item.id !== id))
    }
  }

  const onCheckRemoved = ids => {
    let newFavs = [...favs]
    ids.forEach(id => {
      newFavs.filter(e => e._id !== id)
    })
    setFavs(newFavs)
  }

  const handleRemoveFavs = async () => {
    if (!checkedFavs.length) return
    const newCheckedFavs = checkedFavs.map(item => item.id)
    const { response, err } = await favoriteApi.removeFavs({
      favIds: newCheckedFavs,
    })
    // setOnRequest(false)

    if (err) toast.error(err.message)
    if (response) {
      dispatch(removeFavs({ favIds: newCheckedFavs }))
      onRemoved({ ids: newCheckedFavs })
      setCheckedFavs([])
      toast.success('Remove favorites success!')
    }
  }

  return (
    <div className="mt-4 min-h-[50vh] w-full rounded-md bg-white">
      {favs.map(fav => (
        <FavoriteItem
          id={fav?.id}
          key={fav?.id}
          userId={fav?.user}
          productId={fav?.productId?._id}
          price={fav?.productId?.price}
          title={fav?.productId?.name}
          type={fav?.productId?.type}
          productImage={fav?.productId?.images[0]?.url}
          quantity={fav?.quantity}
          onRemoved={onRemoved}
          onCheckRemoved={onCheckRemoved}
          handleCheckedFav={handleCheckedFav}
          isCheckedAll={isCheckedAll}
          checkedFavs={checkedFavs}
        />
      ))}
      {!favs.length && (
        <div className="flex flex-col items-center justify-center gap-y-4">
          <NotFound text={'Bạn chưa có sản phẩm yêu thích nào!'} />
        </div>
      )}
    </div>
  )
}

export default FavoriteList
