import { productsFilterOrganizer } from '@/utils/filters'
import { getSortOrder } from '@/utils/sorts'
import { useSelector } from 'react-redux'

import privateClient from '../client/private.client'

const productEndpoints = {
  list: 'products/list',
  detail: ({ productId }) => `products/detail/${productId}`,
  search: ({ productType, query, page }) =>
    `${productType}/search?query=${query}&page=${page}}`,
  productsOfCateBySlug: ({ cateSlug }) => `products/list/slug/${cateSlug}`,
  getImage: ({ imageName }) => `products/image/${imageName}`,
  productsByShopId: ({ shopId }) => `products/list/shop/${shopId}`,
  getListCategory: `products/list/category`,
}

const productApi = {
  getList: async () => {
    try {
      const response = await privateClient.get(productEndpoints.list)
      return { response }
    } catch (error) {
      return { error }
    }
  },
  getDetail: async ({ productId }) => {
    try {
      const response = await privateClient.get(
        productEndpoints.detail({ productId })
      )
      return { response }
    } catch (error) {
      return { error }
    }
  },
  search: async ({ query, page }) => {
    try {
      const response = await privateClient.get(
        productEndpoints.search({
          query,
          page,
        })
      )
      return { response }
    } catch (error) {
      return { error }
    }
  },
  getProductsOfCateBySlug: async ({ cateSlug }) => {
    try {
      const response = await privateClient.get(
        productEndpoints.productsOfCateBySlug({ cateSlug })
      )
      return { response }
    } catch (error) {
      return { error }
    }
  },
  getProductsByShopId: async ({ shopId }) => {
    try {
      const response = await privateClient.get(
        productEndpoints.productsByShopId({ shopId })
      )
      return { response }
    } catch (error) {
      return { error }
    }
  },
  getImage: async ({ imageName }) => {
    try {
      const response = await privateClient.get(
        productEndpoints.getImage({ imageName })
      )
      return { response }
    } catch (error) {
      return { error }
    }
  },
  getListByCategory: async (n, v, advancedFilters) => {
    try {
      // console.log(n, v, advancedFilters)
      let payload = productsFilterOrganizer(n, v, advancedFilters)
      const sortOrder = getSortOrder(payload.order)
      payload = { ...payload, sortOrder }

      const response = await privateClient.post(
        productEndpoints.getListCategory,
        payload
      )
      const { products, totalPages, currentPage, count } = response

      const newPayload = {
        ...payload,
        products,
        totalPages,
        currentPage,
        count,
      }

      return { newPayload }
    } catch (error) {
      console.log(error)
      return { error }
    }
  },
}

export default productApi
