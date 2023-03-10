import "jquery/dist/jquery.slim.min.js";
import "popper.js/dist/umd/popper.min.js";
import "bootstrap/dist/js/bootstrap.min.js";
import { Link, useNavigate } from "react-router-dom";
import React, {useEffect, useState} from "react";
import { useAuthStore } from "../../hooks/zustand/auth";
import {ICartItem} from "../type/CartItem";
import {showCart} from "../service/SignleProduct";

const Header: React.FC = () => {
    let navigate = useNavigate()
    const resetAuth = useAuthStore((state) => state.resetAuth)
    const name = useAuthStore((state) => state.name)
    function onLogout () {
        resetAuth()
        navigate('/login')
    }

    let nf = new Intl.NumberFormat();
    const idUser = useAuthStore((e) => e.id);
    const accessToken = useAuthStore((e) => e.accessToken);
    let sumPrice = 0;
    console.log('access', idUser)
    const [cartItems, setCartItems] = useState([] as ICartItem[]);
    const [totalPrice, setTotalPrice] = useState(0);
    useEffect(() => {

        localStorage.removeItem('test1')
        showCart(Number(idUser), accessToken).then((response) => {

                console.log(response.data)
                setCartItems(response.data)
            },
            (err) => {
                console.log('OUT', err);
            });
    }, []);
    useEffect(() => {
        cartItems.forEach((e) => {
            console.log(e.priceTotal)

            sumPrice += Number(e.priceTotal)
        })
        setTotalPrice(Number(sumPrice))
    }, [cartItems]);

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white w-100 navigation" id="navbar">
            <div className="container">
                <Link className="navbar-brand font-weight-bold" to={{ pathname: "/home-user" }}>E-Shop</Link>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#main-navbar"
                    aria-controls="main-navbar" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse " id="main-navbar">
                    <ul className="navbar-nav mx-auto">
                        <li className="nav-item active">
                            <Link className="nav-link" to={{ pathname: "/home-user" }}>Trang ch???</Link>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="!#">Gi???i thi???u</a>
                        </li>

                        <li className="nav-item dropdown dropdown-slide">
                            <a className="nav-link dropdown-toggle" href="!#" id="navbarDropdown4" role="button" data-delay="350"
                                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                C??c trang.
                            </a>
                            <ul className="dropdown-menu" aria-labelledby="navbarDropdown4">
                                <li><a href="!#">V??? ch??ng t??i</a></li>
                                <li><a href="!#">Blog</a></li>
                                <li><a href="!#">Blog ????n</a></li>
                                <li><a href="!#">Li??n h???</a></li>
                                <li><a href="!#">404 Trang</a></li>
                                <li><a href="!#">C??u h???i th?????ng g???p</a></li>
                            </ul>
                        </li>
                        <li className="nav-item dropdown dropdown-slide">
                            <a className="nav-link dropdown-toggle" href="!#" id="navbarDropdown3" role="button" data-delay="350"
                                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                C???a h??ng.
                            </a>
                            <ul className="dropdown-menu" aria-labelledby="navbarDropdown3">
                                <li><Link to={{ pathname: "/shop" }}>C???a h??ng</Link></li>
                                <li><Link to={{ pathname: "/checkout" }}>Th??? t???c thanh to??n</Link></li>
                            </ul>
                        </li>

                    </ul>
                </div>

                <ul className="top-menu list-inline mb-0 d-none d-lg-block" id="top-menu">
                    <li className="list-inline-item">
                        <a href="!#" className="search_toggle" id="search-icon"><i className="tf-ion-android-search"></i></a>
                    </li>
                    <li className="dropdown cart-nav dropdown-slide list-inline-item">
                        <a href="!#" className="dropdown-toggle cart-icon" data-toggle="dropdown" data-hover="dropdown">
                            <i className="tf-ion-android-cart"></i>
                        </a>
                        <div className="dropdown-menu cart-dropdown">

                            <div className="media">
                                <a href="/product-single">
                                    <img className="media-object img- mr-3" src="assets/images/cart-1.jpg" alt="image" />
                                </a>
                                <div className="media-body">
                                    <h6>T??i ph??? n???</h6>
                                    <div className="cart-price">
                                        <span>1 x</span>
                                        <span>1250.00</span>
                                    </div>
                                </div>
                                <a href="!#" className="remove"><i className="tf-ion-close"></i></a>
                            </div>

                            <div className="media">
                                <a href="/product-single">
                                    <img className="media-object img-fluid mr-3" src="assets/images/cart-2.jpg" alt="image" />
                                </a>
                                <div className="media-body">
                                    <h6>Skinny Jeans</h6>
                                    <div className="cart-price">
                                        <span>1 x</span>
                                        <span>1250.00</span>
                                    </div>
                                </div>
                                <a href="!#" className="remove"><i className="tf-ion-close"></i></a>
                            </div>

                            <div className="cart-summary">
                                <span className="h6">T???ng:</span>
                                <span className="total-price h6">$1799.00</span>
                                <div className="text-center cart-buttons mt-3">
                                    <Link className="btn btn-small btn-transparent btn-block" to={{ pathname: "/cart" }}>Xem gi??? h??ng</Link>
                                    <Link className="btn btn-small btn-main btn-block" to={{ pathname: "/checkout" }}>Th??? t???c thanh to??n</Link>
                                </div>
                            </div>
                        </div>
                    </li>
                    <li className="nav-item dropdown dropdown-slide list-inline-item">
                        <a className="nav-link dropdown-toggle" href="!#" id="navbarDropdown3" role="button" data-delay="350"
                           data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <i className="tf-ion-ios-person"></i>
                        </a>
                        <ul className="dropdown-menu" aria-labelledby="navbarDropdown3">
                            <li><a type = "button" onClick={onLogout}>????ng xu???t</a></li>
                            <li><Link to={{ pathname: "/history" }}>l???ch s??? ????n h??ng</Link></li>
                            <li><Link to={{ pathname: "/dashboard" }}>Qu???n tr???</Link></li>
                            <li><Link to={{ pathname: "/login" }}>????ng nh???p</Link></li>
                            <li><Link to={{ pathname: "/signup" }}>????ng k??</Link></li>
                            <li><Link to={{ pathname: "/forgot-password" }}>Qu??n m???t kh???u</Link></li>
                        </ul>
                    </li>
                    <li className="list-inline-item">Xin ch??o: {name}</li>
                </ul>
            </div>
        </nav>
    );
}
export default Header;