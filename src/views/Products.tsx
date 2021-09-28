import * as React from "react"
import { useEffect, useState } from "react"
import { useHistory } from "react-router"
import { domain } from "../util/environnement"
import refresh from "../util/helpers/refresh"
import { http } from "../util/http"
import { IMeta } from "../util/interface/IMeta"

interface IProductsProps {}

interface IProducts {
  meta: IMeta
  data: {
    id: string
    createdAt: string
    deletedAt: string
    title: string
    reference: string
    description: string
    price: number
    category: {
      id: string
      createdAt: string
      updatedAt: string
      deletedAt: string
      label: string
    }
    taxRuleGroup: {
      id: string
    }
  }
}

const Products: React.FunctionComponent<IProductsProps> = (props) => {
  const [productsData, setProductsData] = useState<IProducts>()

  // console.log(productList)
  const history = useHistory()

  const onClick = () => {
    console.log(productsData)
  }

  useEffect(() => {
    const token = sessionStorage.getItem("token")
    const options = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
    http
      .get<IProducts>(`${domain}/v1/product`, options)
      .then(({ data, error }) => {
        if (error) {
        }
        setProductsData(data)
      })
  }, [])

  return (
    <div className="products" onClick={onClick}>
      {productsData && productsData.data[0].title}
    </div>
  )
}

export default Products
