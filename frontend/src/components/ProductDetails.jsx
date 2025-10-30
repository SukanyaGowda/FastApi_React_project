import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../api/api";

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await getProductById(id);
      setProduct(res.data);
    };
    fetchProduct();
  }, [id]);

  if (!product) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-3">{product.name}</h1>
      <p>{product.description}</p>
      <p className="text-xl text-blue-600 mt-2">₹{product.price}</p>
    </div>
  );
}

export default ProductDetails;
