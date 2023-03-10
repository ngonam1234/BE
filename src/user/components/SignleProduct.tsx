import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDetailProduct } from "../service/HomePage";
import { addToCart, getProductOption } from "../service/SignleProduct";
import { IInfo } from "../type/HomePage";
import FormLabel from '@mui/joy/FormLabel';
import Radio, { radioClasses } from '@mui/joy/Radio';
import RadioGroup from '@mui/joy/RadioGroup';
import Sheet from '@mui/joy/Sheet';
import { useAuthStore } from "../../hooks/zustand/auth";
import Swal from "sweetalert2";
function SingleProduct() {
    const accessToken = useAuthStore((e) => e.accessToken)
    let nf = new Intl.NumberFormat();
    const { id } = useParams();
    const [infos, setInfos] = useState({} as IInfo);
    const [option1, setOption1] = useState([]);
    const [option2, setOption2] = useState([]);
    const [option3, setOption3] = useState([]);

    const [op1, setOp1] = useState('');
    const [op2, setOp2] = useState('');
    const [op3, setOp3] = useState('');

    const [quantityBuy, setQuantityBuy] = useState(1);

    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
    })


    useEffect(() => {
        getDetailProduct(parseInt(id as string)).then((response) => {
            setInfos(response.data.InfoProduct)
            setOption1(response.data.Option1)
            setOption2(response.data.Option2)
            setOption3(response.data.Option3)
        });



    }, []);


    const defaultOption1 = infos.option1
    const defaultOption2 = infos.option2
    const defaultOption3 = infos.option3


  
    useEffect(() => { onChangeOptions() }, [op1, op2, op3])

    const onChangeOptions = () =>
    (
        console.log(" op1:" + op1),
        console.log(" op2:" + op2),
        console.log(" op3:" + op3),
        getProductOption(parseInt(id as string), op1 as string, op2 as string, op3 as string).then((response) => {
            console.log(response.data)
            setInfos(response.data)
        }))
    const addToCartCustomer = () => {
        console.log('In add to cart')
        console.log('Quantity ????', quantityBuy);
        addToCart(Number(quantityBuy), infos.id, accessToken).then((res) => {
            console.log(res.data)
            Toast.fire({
                icon: 'success',
                title: 'Th??m v??o gi??? th??nh c??ng '
              })
        }, (err) => {
            console.log(err)
            Toast.fire({
                icon: 'success',
                title: 'Th??m v??o gi??? th???t b???i'
              })
        })
    }
    return (
        <div className="single-product-container">
            <section className="page-header">
                <div className="overly"></div>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-6">
                            <div className="content text-center">
                                <h1 className="mb-3">CHI TI???T S???N PH???M</h1>
                                <nav aria-label="breadcrumb">
                                    <ol className="breadcrumb bg-transparent justify-content-center">
                                        <li className="breadcrumb-item"><a href="/">Trang ch???</a></li>
                                        <li className="breadcrumb-item active" aria-current="page">Chi ti???t s???n ph???m</li>
                                    </ol>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="single-product">
                <div className="container">
                    <div className="row">
                        <div className="col-md-5">
                            <div className="single-product-slider">
                                <div className="carousel slide" data-ride="carousel" id="single-product-slider">
                                    <div className="carousel-inner">
                                        <div className="carousel-item active">
                                            <img src={infos.image} alt="" className="img-fluid" />
                                        </div>
                                        <div className="carousel-item">
                                            <img src={infos.image} alt="" className="img-fluid" />
                                        </div>
                                        <div className="carousel-item ">
                                            <img src={infos.image} alt="" className="img-fluid" />
                                        </div>
                                    </div>

                                    <ol className="carousel-indicators">
                                        <li data-target="#single-product-slider" data-slide-to="0" className="active">
                                            <img src="assets/images/product-3.jpg" alt="" className="img-fluid" />
                                        </li>
                                        <li data-target="#single-product-slider" data-slide-to="1">
                                            <img src="assets/images/product-2.jpg" alt="" className="img-fluid" />
                                        </li>
                                        <li data-target="#single-product-slider" data-slide-to="2">
                                            <img src="assets/images/product-1.jpg" alt="" className="img-fluid" />
                                        </li>
                                    </ol>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-7">
                            <div className="single-product-details mt-5 mt-lg-0">
                                <h2>{infos.name}</h2>
                                <div className="sku_wrapper mb-4">
                                    M?? h??ng: <span className="text-muted">AB1563456789 </span>
                                </div>

                                <hr />

                                <h3 className="product-price">{nf.format(infos.price)} vnd<del>$119.90</del></h3>

                                <p className="product-description my-4 ">
                                    ??i???u r???t quan tr???ng ?????i v???i kh??ch h??ng l?? ph???i ch?? ?? ?????n qu?? tr??nh adipiscing. Ng?????i ta cho r???ng, b???n th??n lao ?????ng l?? do c?? ng?????i b??? m???c cho ??au ?????n, h?????ng l???i. T???t c??? c??c k???t qu??? h???nh ph??c c???a ch??ng t??i, k???t qu??? c???a h???? N?? s??? l?? h???u qu??? c???a vi???c t??? ch???i ch??nh l???i n??i.
                                </p>

                                {/* <form className="cart" action="#" method="post"> */}
                                <div className="quantity d-flex align-items-center">
                                    <input type="number" id="qty" className="input-text qty text form-control w-25 mr-3"

                                        onChange={(e: any) => {
                                            setQuantityBuy(e.target.value)
                                        }}
                                        max={infos.quantity} name="quantity" size={4} value={quantityBuy}/>
                                    <button className="btn btn-main btn-small"
                                        onClick={() => {
                                            addToCartCustomer()
                                        }}
                                    >Add to cart</button>
                                </div>
                                {/* </form> */}


                                <div className="color-swatches mt-4 d-flex align-items-center">
                                    <span className="font-weight-bold text-capitalize product-meta-title ">M??u s???c:</span>
                                    <RadioGroup
                                        aria-label="platform"
                                        defaultValue={defaultOption1}
                                        overlay
                                        name="platform"
                                        onChange={(event) => {
                                            setOp1(event.target.value)

                                        }}
                                        sx={{
                                            flexDirection: 'row',
                                            gap: 1,
                                            [`& .${radioClasses.checked}`]: {
                                                [`& .${radioClasses.action}`]: {
                                                    inset: -1,
                                                    border: '2px solid',
                                                    borderColor: 'primary.500',
                                                },
                                            },
                                            [`& .${radioClasses.radio}`]: {
                                                display: 'contents',
                                            },
                                        }}
                                    >
                                        {option1.map((value) => (
                                            <Sheet
                                                key={value}
                                                variant="outlined"
                                                sx={{
                                                    borderRadius: '10px',
                                                    bgcolor: 'background.level1',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    p: 1,
                                                    minWidth: 60,
                                                }}
                                            >
                                                <Radio id={value} value={value} />
                                                <FormLabel htmlFor={value}>{value}</FormLabel>
                                            </Sheet>
                                        ))}
                                    </RadioGroup>
                                </div>

                                <div className="product-size d-flex align-items-center mt-4">
                                    <span className="font-weight-bold text-capitalize product-meta-title">K??ch th?????c:</span>
                                    <RadioGroup
                                        aria-label="platform"
                                        defaultValue={defaultOption2}
                                        overlay
                                        name="platform"
                                        onChange={(event) => {
                                            setOp2(event.target.value)
                                        }}
                                        sx={{
                                            flexDirection: 'row',
                                            gap: 1,
                                            [`& .${radioClasses.checked}`]: {
                                                [`& .${radioClasses.action}`]: {
                                                    inset: -1,
                                                    border: '2px solid',
                                                    borderColor: 'primary.500',
                                                },
                                            },
                                            [`& .${radioClasses.radio}`]: {
                                                display: 'contents',
                                            },
                                        }}
                                    >
                                        {option2.map((value) => (
                                            <Sheet
                                                key={value}
                                                variant="outlined"
                                                sx={{
                                                    borderRadius: '10px',
                                                    bgcolor: 'background.level1',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    p: 1,
                                                    minWidth: 60,
                                                }}
                                            >
                                                <Radio id={value} value={value}  />
                                                <FormLabel htmlFor={value}>{value}</FormLabel>
                                            </Sheet>
                                        ))}
                                    </RadioGroup>
                                </div>

                                <div className="products-meta mt-4">
                                    <div className="product-category d-flex align-items-center">
                                        <span className="font-weight-bold text-capitalize product-meta-title">Ch???t li???u:</span>
                                        <RadioGroup
                                            aria-label="platform"
                                            defaultValue={defaultOption3}
                                            overlay
                                            name="platform"
                                            onChange={(event) => {
                                                setOp3(event.target.value)
                                            }}
                                            sx={{
                                                flexDirection: 'row',
                                                gap: 1,
                                                [`& .${radioClasses.checked}`]: {
                                                    [`& .${radioClasses.action}`]: {
                                                        inset: -1,
                                                        border: '2px solid',
                                                        borderColor: 'primary.500',
                                                    },
                                                },
                                                [`& .${radioClasses.radio}`]: {
                                                    display: 'contents',
                                                },
                                            }}
                                        >
                                            {option3.map((value) => (
                                                <Sheet
                                                    key={value}
                                                    variant="outlined"
                                                    sx={{
                                                        borderRadius: '10px',
                                                        bgcolor: 'background.level1',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'center',
                                                        p: 1,
                                                        minWidth: 60,
                                                    }}
                                                >
                                                    <Radio id={value} value={value} />
                                                    <FormLabel htmlFor={value}>{value}</FormLabel>
                                                </Sheet>
                                            ))}
                                        </RadioGroup>
                                    </div>

                                    <div className="product-share mt-5">
                                        <ul className="list-inline">
                                            <li className="list-inline-item">
                                                <a href="!#"><i className="tf-ion-social-facebook"></i></a>
                                            </li>
                                            <li className="list-inline-item">
                                                <a href="!#"><i className="tf-ion-social-twitter"></i></a>
                                            </li>
                                            <li className="list-inline-item">
                                                <a href="!#"><i className="tf-ion-social-linkedin"></i></a>
                                            </li>
                                            <li className="list-inline-item">
                                                <a href="!#"><i className="tf-ion-social-pinterest"></i></a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="row">
                        <div className="col-lg-12">
                            <nav className="product-info-tabs wc-tabs mt-5 mb-5">
                                <div className="nav nav-tabs nav-fill" id="nav-tab" role="tablist">
                                    <a className="nav-item nav-link active" id="nav-home-tab" data-toggle="tab" href="#nav-home" role="tab" aria-controls="nav-home" aria-selected="true">Description</a>
                                    <a className="nav-item nav-link" id="nav-profile-tab" data-toggle="tab" href="#nav-profile" role="tab" aria-controls="nav-profile" aria-selected="false">Additional Information</a>
                                    <a className="nav-item nav-link" id="nav-contact-tab" data-toggle="tab" href="#nav-contact" role="tab" aria-controls="nav-contact" aria-selected="false">Reviews(2)</a>
                                </div>
                            </nav>

                            <div className="tab-content" id="nav-tabContent">
                                <div className="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">
                                    <p>Tr??? em ??ang s???ng v???i b???nh t???t, tu???i gi?? v?? tr??? em, v?? h??? ??ang ph???i ch???u ?????ng c??i ????i v?? c??i ngh??o. Vestibulum tra t???n quam, feugiat vitae, c???n t???i t??n, th???i gian ph???i c?? tr?????c ????. Cho ?????n l??c ????, b??ng ???? t??? do quan tr???ng h??n bao gi??? h???t. Aenean l?? k??? th?? c???a cu???c ?????i t??i. Mauris investmentrat eleifend leo.</p>

                                    <h4>T??nh n??ng s???n ph???m</h4>

                                    <ul className="">
                                        <li>???????c ??nh x??? v???i 3M ??? Thinsulate ??? C??ch nhi???t [40G Th??n ??o / Tay ??o / M?? tr??m]</li>
                                        <li>L??t Taffeta d???p n???i</li>
                                        <li>V???i Oxford 2 l???p DRYRIDE Durashell ??? [10.000MM, 5.000G]</li>
                                    </ul>

                                </div>
                                <div className="tab-pane fade" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab">

                                    <ul className="list-unstyled info-desc">
                                        <li className="d-flex">
                                            <strong>Tr???ng l?????ng </strong>
                                            <span>400 g</span>
                                        </li>
                                        <li className="d-flex">
                                            <strong>K??ch th?????c </strong>
                                            <span>10 x 10 x 15 cm</span>
                                        </li>
                                        <li className="d-flex">
                                            <strong>V???t li???u</strong>
                                            <span >60% cotton, 40% polyester</span>
                                        </li>
                                        <li className="d-flex">
                                            <strong>M??u s???c </strong>
                                            <span>Blue, Gray, Green, Red, Yellow</span>
                                        </li>
                                        <li className="d-flex">
                                            <strong>K??ch th?????c</strong>
                                            <span>L, M, S, XL, XXL</span>
                                        </li>
                                    </ul>
                                </div>
                                <div className="tab-pane fade" id="nav-contact" role="tabpanel" aria-labelledby="nav-contact-tab">
                                    <div className="row">
                                        <div className="col-lg-7">
                                            <div className="media review-block mb-4">
                                                <img src="assets/images/avater-1.jpg" alt="reviewimg" className="img-fluid mr-4" />
                                                <div className="media-body">
                                                    <div className="product-review">
                                                        <span><i className="tf-ion-android-star"></i></span>
                                                        <span><i className="tf-ion-android-star"></i></span>
                                                        <span><i className="tf-ion-android-star"></i></span>
                                                        <span><i className="tf-ion-android-star"></i></span>
                                                        <span><i className="tf-ion-android-star"></i></span>
                                                    </div>
                                                    <h6>Therichpost <span className="text-sm text-muted font-weight-normal ml-3">-June 23, 2019</span></h6>
                                                    <p>??i???u r???t quan tr???ng ?????i v???i kh??ch h??ng l?? ph???i ch?? ?? ?????n qu?? tr??nh adipiscing. Anh ta nh???n l???y h???u qu???, nh??n th???y nh???ng ng?????i khen ng???i c?? b??? tr???n. N?? th?????ng l?? m???t sai l???m ????? ????ng.</p>
                                                </div>
                                            </div>

                                            <div className="media review-block">
                                                <img src="assets/images/avater-2.jpg" alt="reviewimg" className="img-fluid mr-4" />
                                                <div className="media-body">
                                                    <div className="product-review">
                                                        <span><i className="tf-ion-android-star"></i></span>
                                                        <span><i className="tf-ion-android-star"></i></span>
                                                        <span><i className="tf-ion-android-star"></i></span>
                                                        <span><i className="tf-ion-android-star"></i></span>
                                                        <span><i className="tf-ion-android-star-outline"></i></span>
                                                    </div>
                                                    <h6>Therichpost <span className="text-sm text-muted font-weight-normal ml-3">-June 23, 2019</span></h6>
                                                    <p>??i???u r???t quan tr???ng ?????i v???i kh??ch h??ng l?? ph???i ch?? ?? ?????n qu?? tr??nh adipiscing. Anh ta nh???n l???y h???u qu???, nh??n th???y nh???ng ng?????i khen ng???i c?? b??? tr???n. N?? th?????ng l?? m???t sai l???m ????? ????ng.</p>
                                                </div>
                                            </div>
                                        </div>


                                        <div className="col-lg-5">
                                            <div className="review-comment mt-5 mt-lg-0">
                                                <h4 className="mb-3">Th??m m???t b??i ????nh gi??</h4>

                                                <form action="#">
                                                    <div className="starrr"></div>
                                                    <div className="form-group">
                                                        <input type="text" className="form-control" placeholder="Your Name" />
                                                    </div>
                                                    <div className="form-group">
                                                        <input type="email" className="form-control" placeholder="Your Email" />
                                                    </div>
                                                    <div className="form-group">
                                                        <textarea name="comment" id="comment" className="form-control" cols={30} rows={4} placeholder="Your Review"></textarea>
                                                    </div>

                                                    <a href="/product-single" className="btn btn-main btn-small">G???i ????nh gi??</a>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            <section className="products related-products section">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-6">
                            <div className="title text-center">
                                <h2>B???n c?? th??? th??ch ??i???u n??y</h2>
                                <p>B??n h??ng tr???c tuy???n t???t nh???t ????? mua s???m v??o cu???i tu???n n??y</p>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-3 col-6" >
                            <div className="product">
                                <div className="product-wrap">
                                    <a href="/product-single"><img className="img-fluid w-100 mb-3 img-first" src="assets/images/322.jpg" alt="product-img" /></a>
                                    <a href="/product-single"><img className="img-fluid w-100 mb-3 img-second" src="assets/images/444.jpg" alt="product-img" /></a>
                                </div>

                                <span className="onsale">Doanh thu</span>
                                <div className="product-hover-overlay">
                                    <a href="!#"><i className="tf-ion-android-cart"></i></a>
                                    <a href="!#"><i className="tf-ion-ios-heart"></i></a>
                                </div>

                                <div className="product-info">
                                    <h2 className="product-title h5 mb-0"><a href="/product-single">Kirby Shirt</a></h2>
                                    <span className="price">
                                        $329.10
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-3 col-6" >
                            <div className="product">
                                <div className="product-wrap">
                                    <a href="/product-single"><img className="img-fluid w-100 mb-3 img-first" src="assets/images/111.jpg" alt="product-img" /></a>
                                    <a href="/product-single"><img className="img-fluid w-100 mb-3 img-second" src="assets/images/222.jpg" alt="product-img" /></a>
                                </div>

                                <span className="onsale">Doanh thu</span>
                                <div className="product-hover-overlay">
                                    <a href="!#"><i className="tf-ion-android-cart"></i></a>
                                    <a href="!#"><i className="tf-ion-ios-heart"></i></a>
                                </div>

                                <div className="product-info">
                                    <h2 className="product-title h5 mb-0"><a href="/product-single">Kirby Shirt</a></h2>
                                    <span className="price">
                                        $329.10
                                    </span>
                                </div>
                            </div>
                        </div>


                        <div className="col-lg-3 col-6" >
                            <div className="product">
                                <div className="product-wrap">
                                    <a href="/product-single"><img className="img-fluid w-100 mb-3 img-first" src="assets/images/111.jpg" alt="product-img" /></a>
                                    <a href="/product-single"><img className="img-fluid w-100 mb-3 img-second" src="assets/images/322.jpg" alt="product-img" /></a>
                                </div>

                                <span className="onsale">Doanh thu</span>
                                <div className="product-hover-overlay">
                                    <a href="!#"><i className="tf-ion-android-cart"></i></a>
                                    <a href="!#"><i className="tf-ion-ios-heart"></i></a>
                                </div>

                                <div className="product-info">
                                    <h2 className="product-title h5 mb-0"><a href="/product-single">Kirby Shirt</a></h2>
                                    <span className="price">
                                        $329.10
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-3 col-6">
                            <div className="product">
                                <div className="product-wrap">
                                    <a href="/product-single"><img className="img-fluid w-100 mb-3 img-first" src="assets/images/444.jpg" alt="product-img" /></a>
                                    <a href="/product-single"><img className="img-fluid w-100 mb-3 img-second" src="assets/images/222.jpg" alt="product-img" /></a>
                                </div>

                                <span className="onsale">Doanh thu</span>
                                <div className="product-hover-overlay">
                                    <a href="!#"><i className="tf-ion-android-cart"></i></a>
                                    <a href="!#"><i className="tf-ion-ios-heart"></i></a>
                                </div>

                                <div className="product-info">
                                    <h2 className="product-title h5 mb-0"><a href="/product-single">Kirby Shirt</a></h2>
                                    <span className="price">
                                        $329.10
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
export default SingleProduct;
