import React, { useEffect, useState } from "react";
import { Container } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { FreeMode, Navigation, Thumbs } from "swiper";
import { Link, useParams } from "react-router-dom";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";

import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";
import { setChosenProduct, setRestaurant } from "./slice";
import { createSelector } from "reselect";
import { retrieveChosenProduct, retrieveRestaurant } from "./selector";
import { Product } from "../../../lib/types/product";
import ProductService from "../../services/ProductService";
import MemberService from "../../services/MemberService";
import { Member } from "../../../lib/types/member";
import { CartItem } from "../../../lib/types/search";
import { collectionLabels, imageUrl, money, productServing } from "../../../lib/format";
import { ProductCollection } from "../../../lib/enums/product.enum";
import ProductCard from "../../components/common/ProductCard";
import { SITE } from "../../../lib/data/site";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

const actionDispatch = (dispatch: Dispatch) => ({
  setChosenProduct: (data: Product | null) => dispatch(setChosenProduct(data)),
  setRestaurant: (data: Member) => dispatch(setRestaurant(data)),
});

const chosenProductRetriever = createSelector(retrieveChosenProduct, (chosenProduct) => ({ chosenProduct }));
const restaurantRetriever = createSelector(retrieveRestaurant, (restaurant) => ({ restaurant }));

interface ChosenProducteProps {
  onAdd: (item: CartItem) => void;
}

export default function ChosenProduct(props: ChosenProducteProps) {
  const { onAdd } = props;
  const { setRestaurant, setChosenProduct } = actionDispatch(useDispatch());
  const { productId } = useParams<{ productId: string }>();
  const { restaurant } = useSelector(restaurantRetriever);
  const { chosenProduct } = useSelector(chosenProductRetriever);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperCore | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [related, setRelated] = useState<Product[]>([]);
  const [notFound, setNotFound] = useState<boolean>(false);

  useEffect(() => {
    setQuantity(1);
    setNotFound(false);
    setChosenProduct(null);
    const product = new ProductService();
    product
      .getProduct(productId)
      .then((data) => {
        setChosenProduct(data);
        return product.getProducts({
          page: 1,
          limit: 5,
          order: "productViews",
          productCollection: data.productCollection as ProductCollection,
        });
      })
      .then((data) => setRelated(data.filter((item) => item._id !== productId).slice(0, 4)))
      .catch((err) => {
        console.log(err);
        setNotFound(true);
      });

    const member = new MemberService();
    member
      .getRestaurant()
      .then((data) => setRestaurant(data))
      .catch((err) => console.log(err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  if (notFound) {
    return (
      <Container className="detail-page">
        <div className="empty">
          <h3>This product is not available</h3>
          <p>It may have been removed from the menu.</p>
          <p style={{ marginTop: 20 }}>
            <Link to="/products" className="btn btn-primary">Back to menu</Link>
          </p>
        </div>
      </Container>
    );
  }

  if (!chosenProduct) {
    return (
      <Container className="detail-page">
        <div className="detail-grid">
          <div className="skeleton" style={{ aspectRatio: "1 / 1" }} />
          <div className="skeleton" style={{ height: 420 }} />
        </div>
      </Container>
    );
  }

  const left = chosenProduct.productLeftCount;
  const soldOut = left <= 0;
  const maxQuantity = Math.max(1, left);
  const images = chosenProduct.productImages.length ? chosenProduct.productImages : [""];

  const addHandler = () => {
    onAdd({
      _id: chosenProduct._id,
      quantity,
      name: chosenProduct.productName,
      price: chosenProduct.productPrice,
      image: chosenProduct.productImages[0],
    });
  };

  return (
    <div className="detail">
      <Container className="detail-page">
        <Link to="/products" className="back-link">
          <ArrowBackRoundedIcon fontSize="small" /> Back to menu
        </Link>

        <div className="detail-grid">
          <div className="detail-gallery">
            <Swiper
              key={chosenProduct._id}
              loop={images.length > 1}
              spaceBetween={10}
              navigation={images.length > 1}
              thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
              modules={[FreeMode, Navigation, Thumbs]}
              className="detail-main"
            >
              {images.map((ele: string, index: number) => (
                <SwiperSlide key={index}>
                  <img src={imageUrl(ele, "/icons/noimage-list.svg")} alt={chosenProduct.productName} />
                </SwiperSlide>
              ))}
            </Swiper>
            {images.length > 1 && (
              <Swiper
                onSwiper={setThumbsSwiper}
                spaceBetween={10}
                slidesPerView={4}
                freeMode
                watchSlidesProgress
                modules={[FreeMode, Navigation, Thumbs]}
                className="detail-thumbs"
              >
                {images.map((ele: string, index: number) => (
                  <SwiperSlide key={index}>
                    <img src={imageUrl(ele)} alt="" />
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>

          <div className="detail-info">
            <div className="detail-tags">
              <span className="badge">{collectionLabels[chosenProduct.productCollection] ?? chosenProduct.productCollection}</span>
              <span className="detail-views">
                <VisibilityOutlinedIcon fontSize="small" /> {chosenProduct.productViews} views
              </span>
            </div>
            <h1>{chosenProduct.productName}</h1>
            <p className="detail-desc">{chosenProduct.productDesc || "Freshly made to order."}</p>

            <div className="detail-specs">
              <div>
                <span>{chosenProduct.productCollection === ProductCollection.SMOOTHIE ? "Volume" : "Size"}</span>
                <strong>{productServing(chosenProduct)}</strong>
              </div>
              <div>
                <span>Availability</span>
                <strong className={soldOut ? "out" : left < 5 ? "low" : "in"}>
                  {soldOut ? "Sold out" : left < 5 ? `Only ${left} left` : "In stock"}
                </strong>
              </div>
            </div>

            <div className="detail-buy">
              <span className="detail-price">{money(chosenProduct.productPrice)}</span>
              <div className="qty qty-lg" aria-label="Quantity">
                <button type="button" aria-label="Decrease" disabled={quantity <= 1} onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
                  <RemoveRoundedIcon />
                </button>
                <span>{quantity}</span>
                <button type="button" aria-label="Increase" disabled={quantity >= maxQuantity} onClick={() => setQuantity((q) => Math.min(maxQuantity, q + 1))}>
                  <AddRoundedIcon />
                </button>
              </div>
            </div>

            <button type="button" className="btn btn-primary detail-cta" disabled={soldOut} onClick={addHandler}>
              <ShoppingBagOutlinedIcon />
              {soldOut ? "Sold out" : `Add to basket · ${money(chosenProduct.productPrice * quantity)}`}
            </button>

            <ul className="detail-perks">
              <li>
                <LocalShippingOutlinedIcon />
                <span>Delivery {money(SITE.deliveryFee)} · free from {money(SITE.freeDeliveryFrom)}</span>
              </li>
              <li>
                <StorefrontOutlinedIcon />
                <span>
                  {restaurant?.memberNick ?? SITE.name} · {restaurant?.memberAddress ?? SITE.address} · {SITE.phone}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {related.length > 0 && (
          <section className="detail-related">
            <div className="section-head">
              <div>
                <span className="eyebrow">You may also like</span>
                <h2 className="section-title">More {collectionLabels[chosenProduct.productCollection]?.toLowerCase()}</h2>
              </div>
            </div>
            <div className="product-grid">
              {related.map((product) => (
                <ProductCard key={product._id} product={product} onAdd={onAdd} showCategory={false} />
              ))}
            </div>
          </section>
        )}
      </Container>
    </div>
  );
}
