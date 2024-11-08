"use client"
import React,{useEffect, useState} from "react"
import ProductCard from "./ProductCard"

export default function ProductSection({products}) {

  const [currentType,setCurrentType] = useState('Newly Added')

  useEffect(()=>{
    if (products.length>0){
      setCurrentType(products[0].type)
    }
  },[])

  return (
    <section className="products container section">
      <div className="tab__btns">
        {products
          .map(product => product.type)
          .filter((type, index, self) => self.indexOf(type) === index)
          .map((type,index) => (
            <span className={type===currentType?"tab__btn active-tab":"tab__btn"} data-target="#new-added" onClick={()=>setCurrentType(type)} key={index}>{type}</span>
          ))}
      </div>

      <div className="tab__items">
        <div className="tab__item active-tab" id="featured">
          <div className="products__container grid">
            {products.filter((product)=>(product.type === currentType)).map((product, index) => (
              <ProductCard product={product} key={index}/>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}