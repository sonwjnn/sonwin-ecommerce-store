import { useDispatch } from 'react-redux'
import ProductGrid from './ProductGrid'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { setGlobalLoading } from '../../redux/features/globalLoadingSlice'
import productApi from '../../apis/modules/product.api'
import { toast } from 'react-hot-toast'
import { filterTypeOrder } from '../../utilities/filters'
import BoardBar from './BoardBar'
import { mapOrder } from '../../utilities/sorts'

const ProductList = () => {
  const dispatch = useDispatch()
  const { typeName, cateName } = useParams()
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [payloadProducts, setPayloadProducts] = useState([])
  const [priceOption, setPriceOption] = useState('')

  useEffect(() => {
    const getProducts = async () => {
      dispatch(setGlobalLoading(true))
      const { response, err } = await productApi.getProductsOfCate({ cateName })
      dispatch(setGlobalLoading(false))

      if (err) toast.error(err.message)
      if (response) {
        setProducts(response)
      }
    }
    getProducts()
  }, [dispatch])

  useEffect(() => {
    if (typeName === 'Tất cả sản phẩm') {
      setFilteredProducts(products)
    } else {
      const newFilteredProducts = filterTypeOrder(products, typeName, 'typeId')
      setFilteredProducts(newFilteredProducts)
    }
  }, [typeName, products])

  useEffect(() => {
    if (priceOption === 'Thấp đến cao') {
      const newFilteredProducts = mapOrder(
        [...filteredProducts],
        'dec',
        'price'
      )
      setFilteredProducts(newFilteredProducts)
    } else if (priceOption === 'Cao đến thấp') {
      const newFilteredProducts = mapOrder([...filteredProducts], null, 'price')
      setFilteredProducts(newFilteredProducts)
    }
  }, [priceOption])

  useEffect(() => {
    setPayloadProducts([...filteredProducts])
  }, [filteredProducts])

  const handleSelectPriceOption = e => {
    setPriceOption(e.target.innerText)
  }

  return (
    <>
      <BoardBar handleSelectPriceOption={handleSelectPriceOption} />
      <ProductGrid products={payloadProducts} />
    </>
  )
}

export default ProductList
