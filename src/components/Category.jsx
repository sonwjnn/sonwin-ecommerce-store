import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import categoryApi from '../apis/modules/category.api'
import { setGlobalLoading } from '../redux/features/globalLoadingSlice'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'
import { productType } from '../routes/routes'

const Category = ({ productCategory }) => {
  const dispatch = useDispatch()
  const [categories, setCategories] = useState([])

  useEffect(() => {
    const getCategories = async () => {
      const { response, err } = await categoryApi.getList()

      if (response.kq) setCategories(response.data)
      // if (response.msg) toast.error(response.msg)
      dispatch(setGlobalLoading(false))
    }

    getCategories()
  }, [productCategory, dispatch])

  useEffect(() => {}, [])

  return (
    <>
      <nav className="category">
        <header className="category__heading">DANH MỤC</header>
        <ul className="category-list">
          {categories.map((cate, index) => (
            <li className="category-item" key={cate._id}>
              <Link
                to={`/products/${productType[index]}`}
                className="category-item__link"
              >
                {cate.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  )
}

export default Category
