
import React, { useEffect, useState } from "react"
import { useAuthStore } from "../../hooks/zustand/auth";
import { IHistory, IOrderItem, IOrderReturnItem, IOrderReturn } from "../type/History";
import { getHistoryOrder, getHistoryOrderReturn, getOrderItemHistory, getOrderReturnItemHistory, returnOrder, updateStatus } from "../service/HistoryOrder";
import TablePagination from '@mui/material/TablePagination';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Button, Tabs, Checkbox, TextField } from "@mui/material";
import Tab from '@mui/material/Tab';
import ButtonJoy from '@mui/joy/Button';
import Divider from '@mui/joy/Divider';
import ModalJoy from '@mui/joy/Modal';
import ModalJoyDialog from '@mui/joy/ModalDialog';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import TypographyJoy from '@mui/joy/Typography';
import moment from "moment";
import Swal from "sweetalert2";
interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;

}
function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}
function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
})

const OrderHistory2 = () => {
    let value_new: number;
    const [value, setValue] = React.useState(0);
    const accessToken = useAuthStore((e) => e.accessToken);
    const [currentStatus, setCurrentStatus] = React.useState(5);
    const [openModal, setOpenModal] = React.useState(0);
    const [openModalReturn, setOpenModalReturn] = React.useState(0);
    const [note, setNote] = React.useState('');
    const [selected, setSelected] = React.useState<IOrderItem[]>([]);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        console.log(newValue)
        if (newValue === 0) {
            value_new = 5;
        } else if (newValue === 1) {
            value_new = 6
        } else if (newValue === 2) {
            value_new = 7
        } else if (newValue === 3) {
            value_new = 8
        } else if (newValue === 4) {
            value_new = 10
        } else if (newValue === 5) {
            value_new = 12
        }

        onClickHistory(value_new)
        setValue(newValue);
        setCurrentStatus(value_new);
    };

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>, rows: IOrderItem[]) => {
        if (event.target.checked) {
            const newSelected = rows;
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };
    const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNote(event.target.value);
    };
    const handleClick = (event: React.MouseEvent<unknown>, orderItem: IOrderItem) => {
        const selectedIndex = selected.indexOf(orderItem);
        let newSelected: IOrderItem[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, orderItem);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }
        console.log(newSelected)
        setSelected(newSelected);
    };
    const returnOrderbyIdOrder = (idOrder: number) => {
        let totalQuantityReturn: number = 0;
        let totalPriceReturn: number = 0;
        let idOrderItem: number[] = [];
        selected.map((e) => {
            totalQuantityReturn += e.quantity
            totalPriceReturn += e.total_price
            idOrderItem.push(e.id)
        })
        console.log("data" + note, idOrder, totalPriceReturn, totalQuantityReturn, idOrderItem, accessToken)
        returnOrder(note, idOrder, totalPriceReturn, totalQuantityReturn, idOrderItem, accessToken).then((res) => {
            console.log(res.data)
            onClickHistory(8)
            Toast.fire({
                icon: 'success',
                title: 'Y??u c???u th??nh c??ng'
            })
        }, (err) => {
            console.log(err);
            Toast.fire({
                icon: 'error',
                title: 'Y??u c???u th???t b???i'
            })
        })
    };
    const isSelected = (orderItem: IOrderItem) => selected.indexOf(orderItem) !== -1;
    const hasSelected = selected.length > 0;

    // let item : IOrderItem;
    const [history, setHistory] = useState([] as IHistory[]);
    const [historyReturn, setHistoryReturn] = useState([] as IOrderReturn[]);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        setLoading(true)
        getHistoryOrder(5, accessToken).then((res: any) => {
            setLoading(false)
            const newResult = res.data.map((obj: IHistory) => ({ ...obj, order_item: [] }))
            setHistory(newResult)
        })
    }, [])

    useEffect(() => {
        historyReturn.map((historyReturn) => (
            getOrderReturnItemHistory(historyReturn.id, accessToken).then((res: any) => {
                res.data.map((order_item: IOrderReturnItem) => (
                    console.log(order_item),
                    historyReturn.order_item.push(order_item)
                ))
            })
        ));
    }, [historyReturn])



    const onClickHistory = (status_id: number) => {
        setPage(0);
        setLoading(true)
        if (status_id === 10) {
            let resResult: IHistory[] = []
            getHistoryOrder(status_id, accessToken).then((res: any) => {
                setLoading(false)
                resResult = res.data.map((obj: IHistory) => ({ ...obj, order_item: [] }))
            })
            getHistoryOrder(11, accessToken).then((res: any) => {
                setLoading(false)
                const newResult = res.data.map((obj: IHistory) => ({ ...obj, order_item: [] }))
                resResult.concat(newResult)
            })
            setHistory(resResult)
        } else if (status_id === 12) {
            getHistoryOrderReturn(accessToken).then((res: any) => {
                setLoading(false)
                console.log(res.data);
                const newResult = res.data.map((obj: IOrderReturn) => ({ ...obj, order_item: [] }))
                setHistoryReturn(newResult)
            })
        } else {
            getHistoryOrder(status_id, accessToken).then((res: any) => {
                setLoading(false)
                const newResult = res.data.map((obj: IHistory) => ({ ...obj, order_item: [] }))
                setHistory(newResult)
            })
        }
    }
    const onClickUpdateStatus = (status_id: number, order: IHistory) => {
        const index = history.indexOf(order)
        updateStatus(status_id, order.id, accessToken).then((res) => {
            let newList: IHistory[] = [];
            if (index === 0) {
                newList = newList.concat(history.slice(1));
            } else if (index === selected.length - 1) {
                newList = newList.concat(history.slice(0, -1));
            } else if (index > 0) {
                newList = newList.concat(
                    history.slice(0, index),
                    history.slice(index + 1),
                );
            }
            setHistory(newList)
            if (currentStatus === 0) {
                Toast.fire({
                    icon: 'success',
                    title: 'Hu??? ????n h??ng th??nh c??ng'
                })
            }
            if (currentStatus === 2) {
                Toast.fire({
                    icon: 'success',
                    title: 'Nh???n ????n h??ng th??nh c??ng'
                })
            }

        }, (err) => {
            console.log(err);
            if (currentStatus === 0) {
                Toast.fire({
                    icon: 'error',
                    title: 'Hu??? ????n h??ng th???t b???i'
                })
            }
            if (currentStatus === 2) {
                Toast.fire({
                    icon: 'error',
                    title: 'Nh???n ????n h??ng th???t b???i'
                })
            }
        })
    }
    useEffect(() => {
        history.map((history) => (
            getOrderItemHistory(history.id, accessToken).then((res: any) => {
                res.data.map((order_item: IOrderItem) => (
                    // console.log(order_item),
                    history.order_item.push(order_item)
                ))
            })
        ));
    }, [history])

    function checkDate(date_start: Date) {
        console.log(date_start);
        let date_now = new Date().getTime();
        let date_compare = new Date(date_start).getTime();
        const startDate = moment(date_now);
        const timeEnd = moment(date_compare);
        const diff = startDate.diff(timeEnd);
        const diffDuration = moment.duration(diff);

        if (diffDuration.days() > 3) {
            return true
        } else {
            return false
        }
    }
    function Row(props: { row: IHistory }) {
        const { row } = props;
        const [open, setOpen] = React.useState(false);
        return (
            <React.Fragment>
                <TableRow sx={{ '& > *': { borderBottom: 'unset' } }} hover>
                    <TableCell>
                        <IconButton
                            aria-label="expand row"
                            size="small"
                            onClick={() => setOpen(!open)}
                        >
                            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                    </TableCell>
                    <TableCell component="th" scope="row">
                        {row.id}
                    </TableCell>
                    <TableCell align="center">{row.total_quantity}</TableCell>
                    <TableCell align="center">{row.total_price} </TableCell>
                    <TableCell align="center">{row.fee_money} </TableCell>
                    <TableCell align="center">{row.totalPrice} </TableCell>
                    <TableCell align="center" hidden={!(row.status === 5)}>Ch??? x??c nh???n</TableCell>
                    <TableCell align="center" hidden={!(row.status === 6)}>Ch??? x??c ship l???y h??ng</TableCell>
                    <TableCell align="center" hidden={!(row.status === 7)}>??ang giao h??ng</TableCell>
                    <TableCell align="center" hidden={!(row.status === 8)}>Giao h??ng th??nh c??ng</TableCell>
                    <TableCell align="center" hidden={!(row.status === 9)}>Giao h??ng th???t b???i</TableCell>
                    <TableCell align="center" hidden={!(row.status === 10)}>Hu??? b???i ng?????i d??ng</TableCell>
                    <TableCell align="center" hidden={!(row.status === 11)}>Hu??? b???i admin</TableCell>
                    <TableCell align="center">{row.created_time}</TableCell>
                    <TableCell align="center">
                        <Button hidden={value === 2 ? false : true} onClick={() => { onClickUpdateStatus(8, row) }}>
                            ???? nh???n ???????c h??ng</Button>
                        {/* <Button hidden={value === 0 ? false : true} onClick={() => { console.log(row.id)}}>
                            Hu??? ????n h??ng</Button> */}
                        <Button variant="outlined" color="error"
                            onClick={() => { setOpenModal(row.id); console.log(row.id) }}
                            hidden={value === 0 ? false : true}
                        >
                            Hu??? ????n
                        </Button>
                        <ModalJoy
                            aria-labelledby="alert-dialog-ModalJoy-title"
                            aria-describedby="alert-dialog-ModalJoy-description"
                            open={row.id === openModal}
                            onClose={() => setOpenModal(0)}

                        >
                            <ModalJoyDialog variant="outlined" role="alertdialog">
                                <TypographyJoy
                                    id="alert-dialog-ModalJoy-title"
                                    component="h2"
                                    level="inherit"
                                    fontSize="1.25em"
                                    mb="0.25em"
                                    startDecorator={<WarningRoundedIcon />}
                                >
                                    X??c Nh???n Hu???
                                </TypographyJoy>
                                <Divider sx={{ my: 2 }} />
                                <TypographyJoy
                                    id="alert-dialog-ModalJoy-description"
                                    textColor="text.tertiary"
                                    mb={3}
                                >
                                    B???n c?? ch???c ch???n mu???n h???y ????n h??ng c???a m??nh kh??ng?
                                </TypographyJoy>
                                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                    <ButtonJoy variant="plain" color="neutral" onClick={() => { setOpenModal(0) }}>
                                        Quay L???i
                                    </ButtonJoy>
                                    <Button variant="text" color="error" onClick={() => { onClickUpdateStatus(10, row); setOpenModal(0) }}>
                                        Hu??? ????n
                                    </Button>
                                </Box>
                            </ModalJoyDialog>
                        </ModalJoy>
                    </TableCell>

                </TableRow>
                <TableRow>
                    <TableCell style={{ padding: 0, paddingTop: 0 }} colSpan={8}>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <Box sx={{ margin: 1, alignContent: "center" }}>
                                <Typography variant="h6" gutterBottom component="div">
                                    Chi ti???t
                                </Typography>
                                <div>?????a ch??? nh???n :  {/*{row.diachi}*/}</div>
                                <Table size="small" aria-label="purchases" >
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="center" colSpan={2}>S???n ph???m</TableCell>
                                            <TableCell align="center">Lo???i</TableCell>
                                            <TableCell align="center">S??? l?????ng</TableCell>
                                            <TableCell align="center">????n gi?? (VN??)</TableCell>
                                            <TableCell align="center">Th??nh ti???n (VN??)</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {row.order_item?.map((order_item) => (
                                            <TableRow key={order_item.id}>
                                                <TableCell align="left" width={100}>
                                                    {/* <Avatar src={order_item.image} /> */}
                                                    <img src={order_item.image} width={100} />
                                                </TableCell>
                                                <TableCell align="left" component="th" scope="row" >
                                                    {order_item.name.split('-')[0]}
                                                </TableCell>
                                                <TableCell align="center">{order_item.option1 + ',' + order_item.option2 + ',' + order_item.option3}</TableCell>
                                                <TableCell align="center">{order_item.quantity}</TableCell>
                                                <TableCell align="center">{order_item.price}</TableCell>
                                                <TableCell align="center">{order_item.total_price}</TableCell>
                                            </TableRow>
                                        ))}
                                        <TableRow>
                                            <TableCell rowSpan={4} colSpan={3} />
                                            <TableCell colSpan={2}>T???ng ph???:</TableCell>
                                            <TableCell align="center">{row.total_price} VN??</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell colSpan={2}>Ph?? v???n chuy???n:</TableCell>
                                            <TableCell align="center">{row.fee_money} VN??</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell colSpan={2}>T???ng:</TableCell>
                                            <TableCell align="center">{row.totalPrice} VN??</TableCell>
                                        </TableRow>
                                        <TableRow hidden={value === 3 ? false : true}>
                                            <TableCell colSpan={2}></TableCell>
                                            <TableCell align="right" > <Button variant="contained" color="error" onClick={() => { setOpenModalReturn(row.id); setSelected([]); setNote('') }}>Y??u c???u tr??? h??ng</Button></TableCell>
                                            <TableCell hidden={!row.isReturn} >Ho?? ????n ???? tr??? h??ng</TableCell>
                                            <TableCell hidden={!checkDate(row.date_main)} >Ho?? ????n qu?? h???n tr???</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </Box>
                        </Collapse>
                        <ModalJoy
                            aria-labelledby="alert-dialog-ModalJoy-title"
                            aria-describedby="alert-dialog-ModalJoy-description"
                            open={row.id === openModalReturn}
                            onClose={() => setOpenModalReturn(0)}
                        >
                            <ModalJoyDialog variant="outlined" role="alertdialog">
                                <TypographyJoy
                                    id="alert-dialog-ModalJoy-title"
                                    component="h2"
                                    level="inherit"
                                    fontSize="1.25em"
                                    mb="0.25em"
                                // startDecorator={<WarningRoundedIcon />}
                                >
                                    Ch???n s???n ph???m c???n tr???
                                </TypographyJoy>
                                <Divider sx={{ my: 2 }} />
                                <TypographyJoy
                                    id="alert-dialog-ModalJoy-description"
                                    textColor="text.tertiary"
                                    mb={3}
                                >
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell padding="checkbox">
                                                    <Checkbox
                                                        color="primary"
                                                        checked={row.order_item.length === selected.length}
                                                        onChange={(e) => handleSelectAllClick(e, row.order_item)}
                                                        inputProps={{
                                                            'aria-label': 'select all desserts',
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell align="center" colSpan={2}>S???n ph???m</TableCell>
                                                <TableCell align="center">Lo???i</TableCell>
                                                <TableCell align="center">S??? l?????ng</TableCell>
                                                <TableCell align="center">????n gi?? (VN??)</TableCell>
                                                <TableCell align="center">Th??nh ti???n (VN??)</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody >
                                            {row.order_item?.map((order_item) => (
                                                <TableRow key={order_item.id}
                                                    hover
                                                    onClick={(event) => handleClick(event, (order_item))}
                                                    role="checkbox"
                                                    aria-checked={isSelected((order_item))}
                                                    tabIndex={-1}
                                                    selected={isSelected((order_item))}>
                                                    <TableCell padding="checkbox">
                                                        <Checkbox
                                                            color="primary"
                                                            checked={isSelected(order_item)}
                                                        />
                                                    </TableCell>
                                                    <TableCell align="left" width={100}>
                                                        {/* <Avatar src={order_item.image} /> */}
                                                        <img src={order_item.image} width={100} />
                                                    </TableCell>
                                                    <TableCell align="left" component="th" scope="row" >
                                                        {order_item.name.split('-')[0]}
                                                    </TableCell>
                                                    <TableCell align="center">{order_item.option1 + ',' + order_item.option2 + ',' + order_item.option3}</TableCell>
                                                    <TableCell align="center">{order_item.quantity}</TableCell>
                                                    <TableCell align="center">{order_item.price}</TableCell>
                                                    <TableCell align="center">{order_item.total_price}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                    <TextField autoComplete="off" fullWidth required sx={{ marginTop: 5 }} id="note" label="L?? do tr??? h??ng" variant="outlined"
                                        onChange={handleChangeInput} />
                                </TypographyJoy>
                                <Box component="form" sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }} >
                                    <ButtonJoy variant="plain" color="neutral" onClick={() => { setOpenModalReturn(0) }}>
                                        Quay L???i
                                    </ButtonJoy>
                                    <Button variant="text" disabled={!hasSelected} color="error" type="submit" onClick={() => { returnOrderbyIdOrder(row.id); setOpenModalReturn(0) }}>
                                        Tr??? h??ng
                                    </Button>
                                </Box>
                            </ModalJoyDialog>
                        </ModalJoy>
                    </TableCell>
                </TableRow>
            </React.Fragment >
        );
    }
    function RowReturn(props: { row: IOrderReturn }) {
        const { row } = props;
        const [open, setOpen] = React.useState(false);
        return (
            <React.Fragment>
                <TableRow sx={{ '& > *': { borderBottom: 'unset' } }} hover>
                    <TableCell>
                        <IconButton
                            aria-label="expand row"
                            size="small"
                            onClick={() => setOpen(!open)}
                        >
                            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                    </TableCell>
                    <TableCell component="th" scope="row">
                        {row.id}
                    </TableCell>
                    <TableCell align="center">{row.total_quantity_return}</TableCell>
                    <TableCell align="center">{row.total_price_return} </TableCell>
                    <TableCell align="center">{row.note} </TableCell>
                    <TableCell align="center" hidden={!(row.status_return === 12)}>Ch??? xem x??t</TableCell>
                    <TableCell align="center" hidden={!(row.status_return === 13)}>Shop ?????i nh???n h??ng ho??n</TableCell>
                    <TableCell align="center" hidden={!(row.status_return === 14)}>T??? ch???i y??u c???u</TableCell>
                    <TableCell align="center" hidden={!(row.status_return === 15)}>Shop ???? nh???n ???????c h??ng ho??n</TableCell>
                    <TableCell align="center" hidden={!(row.status_return === 16)}>Shop ???? ho??n ti???n</TableCell>
                    <TableCell align="center">{row.create_date}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style={{ padding: 0, paddingTop: 0 }} colSpan={8}>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <Box sx={{ margin: 1, alignContent: "center" }}>
                                <Typography variant="h6" gutterBottom component="div">
                                    Chi ti???t
                                </Typography>
                                <div>?????a ch??? nh???n :  {/*{row.diachi}*/}</div>
                                <Table size="small" aria-label="purchases" >
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="center" colSpan={2}>S???n ph???m</TableCell>
                                            <TableCell align="center">Lo???i</TableCell>
                                            <TableCell align="center">S??? l?????ng</TableCell>
                                            <TableCell align="center">????n gi?? (VN??)</TableCell>
                                            <TableCell align="center">Th??nh ti???n (VN??)</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {row.order_item?.map((order_item) => (
                                            <TableRow key={order_item.name}>
                                                <TableCell align="left" width={100}>
                                                    {/* <Avatar src={order_item.image} /> */}
                                                    <img src={order_item.image} width={100} />
                                                </TableCell>
                                                <TableCell align="left" component="th" scope="row" >
                                                    {order_item.name.split('-')[0]}
                                                </TableCell>
                                                <TableCell align="center">{order_item.optionProduct}</TableCell>
                                                <TableCell align="center">{order_item.quantity}</TableCell>
                                                <TableCell align="center">{order_item.price}</TableCell>
                                                <TableCell align="center">{order_item.totalPrice}</TableCell>
                                            </TableRow>
                                        ))}
                                        <TableRow>
                                            <TableCell rowSpan={4} colSpan={3} />
                                            <TableCell colSpan={2}>T???ng:</TableCell>
                                            <TableCell align="center">{row.total_quantity_return} VN??</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </Box>
                        </Collapse>
                    </TableCell>
                </TableRow>
            </React.Fragment >
        );
    }
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    // ---------------------------------------------------------


    return (
        <div className="checkout-container container">
            <section className="page-header">
                <div className="overly"></div>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-6">
                            <div className="content text-center">
                                <h1 className="mb-3">L???CH S??? ????N H??NG</h1>
                                <nav aria-label="breadcrumb">
                                    <ol className="breadcrumb bg-transparent justify-content-center">
                                        <li className="breadcrumb-item"><a href="/">Trang ch???</a></li>
                                        <li className="breadcrumb-item active" aria-current="page">l???ch s??? ????n h??ng</li>
                                    </ol>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section>
                <Box sx={{ width: '100%' }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                            <Tab label="Ch??? x??c nh???n" {...a11yProps(0)} />
                            <Tab label="Ch??? l???y h??ng" {...a11yProps(1)} />
                            <Tab label="??ang giao h??ng" {...a11yProps(2)} />
                            <Tab label="???? nh???n ???????c h??ng" {...a11yProps(3)} />
                            <Tab label="???? hu???" {...a11yProps(4)} />
                            <Tab label="Y??u c???u tr??? h??ng" {...a11yProps(4)} />
                        </Tabs>
                    </Box>

                    <TabPanel value={value} index={0}>
                        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                            <TableContainer>
                                <Table aria-label="collapsible table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell />
                                            <TableCell align="center">M?? ho?? ????n</TableCell>
                                            <TableCell align="center">S??? l?????ng</TableCell>
                                            <TableCell align="center">Gi?? ti???n (VN??)</TableCell>
                                            <TableCell align="center">Ph?? v???n chuy???n (VN??)</TableCell>
                                            <TableCell align="center">T???ng ti???n (VN??)</TableCell>
                                            <TableCell align="center">Tr???ng th??i</TableCell>
                                            <TableCell align="center">Ng??y t???o ho?? ????n</TableCell>
                                            <TableCell align="center">Hu??? ????n</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    {loading ? <Box sx={{
                                        left: 0,
                                        magin: 10,
                                        right: 0,
                                        position: 'absolute',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}><CircularProgress /></Box>
                                        : <TableBody>
                                            {history.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                .map((row) => (
                                                    <Row key={row.id} row={row} />
                                                ))}
                                        </TableBody>}
                                </Table>
                            </TableContainer>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                component="div"
                                count={history.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </Paper>
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                            <TableContainer>
                                <Table aria-label="collapsible table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell />
                                            <TableCell align="center">M?? ho?? ????n</TableCell>
                                            <TableCell align="center">S??? l?????ng</TableCell>
                                            <TableCell align="center">Gi?? ti???n (VN??)</TableCell>
                                            <TableCell align="center">Ph?? v???n chuy???n (VN??)</TableCell>
                                            <TableCell align="center">T???ng ti???n (VN??)</TableCell>
                                            <TableCell align="center">Tr???ng th??i</TableCell>
                                            <TableCell align="center">Ng??y t???o ho?? ????n</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    {loading ? <Box sx={{
                                        left: 0,
                                        magin: 10,
                                        right: 0,
                                        position: 'absolute',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}><CircularProgress /></Box>
                                        : <TableBody>
                                            {history.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                .map((row) => (
                                                    <Row key={row.id} row={row} />
                                                ))}
                                        </TableBody>}
                                </Table>
                            </TableContainer>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                component="div"
                                count={history.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </Paper>

                    </TabPanel>
                    <TabPanel value={value} index={2}>
                        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                            <TableContainer>
                                <Table aria-label="collapsible table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell />
                                            <TableCell align="center">M?? ho?? ????n</TableCell>
                                            <TableCell align="center">S??? l?????ng</TableCell>
                                            <TableCell align="center">Gi?? ti???n (VN??)</TableCell>
                                            <TableCell align="center">Ph?? v???n chuy???n (VN??)</TableCell>
                                            <TableCell align="center">T???ng ti???n (VN??)</TableCell>
                                            <TableCell align="center">Tr???ng th??i</TableCell>
                                            <TableCell align="center">Ng??y t???o ho?? ????n</TableCell>
                                            <TableCell align="center">X??c nh???n ????n h??ng</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    {loading ? <Box sx={{
                                        left: 0,
                                        magin: 10,
                                        right: 0,
                                        position: 'absolute',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}><CircularProgress /></Box>
                                        : <TableBody>
                                            {history.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                .map((row) => (
                                                    <Row key={row.id} row={row} />
                                                ))}
                                        </TableBody>}
                                </Table>
                            </TableContainer>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                component="div"
                                count={history.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </Paper>

                    </TabPanel>
                    <TabPanel value={value} index={3}>
                        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                            <TableContainer>
                                <Table aria-label="collapsible table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell />
                                            <TableCell align="center">M?? ho?? ????n</TableCell>
                                            <TableCell align="center">S??? l?????ng</TableCell>
                                            <TableCell align="center">Gi?? ti???n (VN??)</TableCell>
                                            <TableCell align="center">Ph?? v???n chuy???n (VN??)</TableCell>
                                            <TableCell align="center">T???ng ti???n (VN??)</TableCell>
                                            <TableCell align="center">Tr???ng th??i</TableCell>
                                            <TableCell align="center">Ng??y t???o ho?? ????n</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    {loading ? <Box sx={{
                                        left: 0,
                                        magin: 10,
                                        right: 0,
                                        position: 'absolute',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}><CircularProgress /></Box>
                                        : <TableBody>
                                            {history.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                .map((row) => (
                                                    <Row key={row.id} row={row} />
                                                ))}
                                        </TableBody>}
                                </Table>
                            </TableContainer>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                component="div"
                                count={history.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </Paper>

                    </TabPanel>
                    <TabPanel value={value} index={4}>
                        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                            <TableContainer>
                                <Table aria-label="collapsible table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell />
                                            <TableCell align="center">M?? ho?? ????n</TableCell>
                                            <TableCell align="center">S??? l?????ng</TableCell>
                                            <TableCell align="center">Gi?? ti???n (VN??)</TableCell>
                                            <TableCell align="center">Ph?? v???n chuy???n (VN??)</TableCell>
                                            <TableCell align="center">T???ng ti???n (VN??)</TableCell>
                                            <TableCell align="center">Tr???ng th??i</TableCell>
                                            <TableCell align="center">Ng??y t???o ho?? ????n</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    {loading ? <Box sx={{
                                        left: 0,
                                        magin: 10,
                                        right: 0,
                                        position: 'absolute',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}><CircularProgress /></Box>
                                        : <TableBody>
                                            {history.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                .map((row) => (
                                                    <Row key={row.id} row={row} />
                                                ))}
                                        </TableBody>}
                                </Table>
                            </TableContainer>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                component="div"
                                count={history.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </Paper>
                    </TabPanel>
                    <TabPanel value={value} index={5}>
                        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                            <TableContainer>
                                <Table aria-label="collapsible table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell />
                                            <TableCell align="center">M?? ho?? ????n</TableCell>
                                            <TableCell align="center">S??? l?????ng</TableCell>
                                            <TableCell align="center">Gi?? ti???n (VN??)</TableCell>
                                            <TableCell align="center">L?? do tr??? h??ng</TableCell>
                                            <TableCell align="center">Tr???ng th??i</TableCell>
                                            <TableCell align="center">Ng??y t???o y??u c???u</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    {loading ? <Box sx={{
                                        left: 0,
                                        magin: 10,
                                        right: 0,
                                        position: 'absolute',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}><CircularProgress /></Box>
                                        : <TableBody>
                                            {historyReturn.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                .map((row) => (
                                                    <RowReturn key={row.id} row={row} />
                                                ))}
                                        </TableBody>}
                                </Table>
                            </TableContainer>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                component="div"
                                count={history.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </Paper>
                    </TabPanel>
                </Box>
            </section>
        </div>
    )
}
export default OrderHistory2

