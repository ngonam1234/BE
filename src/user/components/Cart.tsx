import { Avatar, Input, Button } from "@mui/material";
import React, { useEffect, useState } from "react"
import { useAuthStore } from "../../hooks/zustand/auth";
import { showCart } from "../service/SignleProduct";
import { ICartItem } from "../type/CartItem";
import { DataGrid, GridCellEditCommitParams, GridColDef, GridColumnHeaderParams } from '@mui/x-data-grid';
import { useNavigate } from "react-router-dom";
import { deleteCart, updateQuantityCart } from "../service/HistoryOrder";
import Swal from 'sweetalert2';
import DeleteIcon from '@mui/icons-material/Delete';
const Cart = () => {
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
    })
    let nf = new Intl.NumberFormat();
    const idUser = useAuthStore((e) => e.id);
    const accessToken = useAuthStore((e) => e.accessToken);
    let sumPrice = 0;
    console.log('access', idUser)
    const [cartItems, setCartItems] = useState([] as ICartItem[]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [loading, setLoading] = useState(false);
    let navigate = useNavigate()

    useEffect(() => {
        localStorage.removeItem('test1')
        setLoading(true)
        showCart(Number(idUser), accessToken).then((response) => {
            setLoading(false)
            console.log(response.data)
            setCartItems(response.data)
        },
            (err) => {
                setLoading(false)
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

    const onClickUpdateQuantityCart = (quantity: number, id_cart_item: number) => {
        console.log(quantity);
        console.log(id_cart_item);
        setLoading(true) 
        updateQuantityCart(quantity, id_cart_item, accessToken).then((res) => {
            console.log(res.data);
            Toast.fire({
                icon: 'success',
                title: 'C???p nh???t th??nh c??ng '
            })
        showCart(Number(idUser), accessToken).then((response) => {
            setLoading(false)
            console.log(response.data)
            setCartItems(response.data)
        },
            (err) => {
                setLoading(false)
                console.log('OUT', err);
            });
        }, (err) => {
            Toast.fire({
                icon: 'error',
                title: err.response.data.description
            })
            console.log(err.response.data.description);
            showCart(Number(idUser), accessToken).then((response) => {
                setLoading(false)
                console.log(response.data)
                setCartItems(response.data)
            },
                (err) => {
                    setLoading(false)
                    console.log('OUT', err);
                });
        })
    }

    const onClickDeleteCartItem = (id_cart_item: number[]) => {
        setLoading(true)
        deleteCart(id_cart_item, accessToken).then((res) => {
            console.log(res.data);
            Toast.fire({
                icon: 'success',
                title: 'C???p nh???t th??nh c??ng '
            })
            showCart(Number(idUser), accessToken).then((response) => {
                setLoading(false)
                console.log(response.data)
                setCartItems(response.data)
            },
                (err) => {
                    setLoading(false)
                    console.log('OUT', err);
                });
        }, (err) => {
            console.log(err);
            Toast.fire({
                icon: 'success',
                title: 'C???p nh???t th???t b???i '
            })
        })
    }

    const columns: GridColDef[] = [
        {
            field: 'image', headerName: '???nh', width: 70, headerAlign: 'center', align: 'center',
            renderCell: (params) => {
                return (
                    <>
                        <Avatar src={params.value} />
                        {params.value.username}
                    </>
                );
            }
        },
        {
            field: 'name', headerName: 'T??n s???n ph???m', width: 150, headerAlign: 'center', align: 'center',
            renderCell: (params) => {
                return (
                    <>
                        {params.value.split('-')[0]}
                    </>
                );
            }
        },
        { field: 'option1', headerName: 'M??u', width: 70, headerAlign: 'center', align: 'center', },
        { field: 'option2', headerName: 'K??ch c???', width: 70, headerAlign: 'center', align: 'center', },
        { field: 'option3', headerName: 'Ch???t li???u', width: 100, headerAlign: 'center', align: 'center', },
        { field: 'quantity', headerName: 'S??? l?????ng', width: 130, headerAlign: 'center', align: 'center', type: 'number', editable: true,
            renderCell: (params) => {
                return (
                    <Input inputProps={{ min: 1, style: { textAlign: 'center' } }} type="number" minRows={1} value={params.row.quantity} onChange={() => { console.log(params);
                     }} disableUnderline={true} />
                );
            }
        },
        {
            field: 'wholesale_price', headerName: 'Gi?? ti???n (VN??)', width: 130, headerAlign: 'center', align: 'center',
            renderCell: (params) => {
                return (
                    <>
                        {params.value}
                    </>
                );
            }
        },
        {
            field: 'priceTotal', headerName: 'T???ng ti???n (VN??)', width: 150, headerAlign: 'center', align: 'center',
            renderCell: (params) => {
                return (
                    <>
                        {params.value}
                    </>
                );
            }
        },
        {
            field: '', headerName: 'Ch???nh s???a', width: 100, headerAlign: 'center', align: 'center',
            renderCell: (params) => {
                return (
                    <>
                        <Button color="error"
                            onClick={() => {
                                const id: number[] = [];
                                let id_main = params.row.id_cart_item
                                id.push(id_main)
                                onClickDeleteCartItem(id)
                            }}
                        >
                            <DeleteIcon />
                        </Button>
                    </>
                )
            }
        }
    ];

    const onRowsSelectionHandler = (ids: any) => {
        const selectedRowsData = ids.map((id: any) => cartItems.find((row) => row.id_cart_item === id));
        const idsCItems: string[] = [];
        selectedRowsData.forEach((e: any) => {
            let { id_cart_item } = e;
            idsCItems.push(id_cart_item)
        });
        localStorage.setItem('test1', JSON.stringify(idsCItems))
    };



    return (
        <div className="checkout-container">
            <section className="page-header">
                <div className="overly"></div>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-6">
                            <div className="content text-center">
                                <h1 className="mb-3">GI??? H??NG</h1>
                                <nav aria-label="breadcrumb">
                                    <ol className="breadcrumb bg-transparent justify-content-center">
                                        <li className="breadcrumb-item"><a href="/">Trang ch???</a></li>
                                        <li className="breadcrumb-item active" aria-current="page">Gi??? h??ng</li>
                                    </ol>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="cart shopping page-wrapper">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-12">
                            <div className="product-list">
                                <form className="cart-form">
                                    <div style={{ height: 400, width: '100%' }}>
                                        <DataGrid
                                            loading={loading}
                                            rows={cartItems}
                                            columns={columns}
                                            pageSize={5}
                                            rowsPerPageOptions={[5]}
                                            getRowId={(cartItems) => cartItems.id_cart_item}
                                            onSelectionModelChange={(ids) => onRowsSelectionHandler(ids)}
                                            checkboxSelection
                                            onCellEditCommit={(params: GridCellEditCommitParams) => {
                                                // Clicking outside the cell vs enter/tab yields different results.
                                                console.log(params);
                                                onClickUpdateQuantityCart(params.value, Number(params.id))
                                            }}
                                        />
                                    </div>

                                    <table className="table shop_table shop_table_responsive cart" cellSpacing="0">
                                        <tr>
                                            <td colSpan={6} className="actions">
                                                <div className="coupon">
                                                    <input type="text" name="coupon_code" className="input-text form-control" id="coupon_code" value="" placeholder="Coupon code" />
                                                    <button type="button" className="btn btn-black btn-small" name="apply_coupon" value="Apply coupon">??p d???ng phi???u gi???m gi??</button>
                                                    <span className="float-right mt-3 mt-lg-0">
                                                        <button type="button" className="btn btn-dark btn-small" name="update_cart" value="Update cart" disabled>C???p nh???t gi??? h??ng</button>
                                                    </span>
                                                </div>
                                                <input type="hidden" id="woocommerce-cart-nonce" name="woocommerce-cart-nonce" value="27da9ce3e8" />
                                                <input type="hidden" name="_wp_http_referer" value="/cart/" />
                                            </td>
                                        </tr>
                                    </table>

                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="row justify-content-end">
                        <div className="col-lg-4">
                            <div className="cart-info card p-4 mt-4">
                                <h4 className="mb-4">T???ng s??? gi??? h??ng</h4>
                                <ul className="list-unstyled mb-4">
                                    <li className="d-flex justify-content-between pb-2 mb-3">
                                        <h5>T???ng ph???:</h5>
                                        <span>{nf.format(totalPrice)} VN??</span>
                                    </li>
                                    <li className="d-flex justify-content-between pb-2 mb-3">
                                        <h5>Ph?? v???n chuy???n:</h5>
                                        <span>Mi???n ph??</span>
                                    </li>
                                    <li className="d-flex justify-content-between pb-2">
                                        <h5>T???ng:</h5>
                                        <span>{nf.format(totalPrice)} VN??</span>
                                    </li>
                                </ul>
                                <button className="btn btn-main btn-small"
                                    onClick={() => {
                                        navigate('/checkout')
                                    }}
                                >Ti???n h??nh ki???m tra</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
export default Cart

