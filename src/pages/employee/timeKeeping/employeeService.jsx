import React from "react";
import {
  Actions,
  ActionsButton,
  ActionsGroup,
  ActionsLabel,
  Button,
  Link,
  ListInput,
  Navbar,
  Page,
  Sheet,
  Subnavbar,
  Tab,
  Tabs,
  Toolbar,
} from "framework7-react";
import NotificationIcon from "../../../components/NotificationIcon";
import ToolBarBottom from "../../../components/ToolBarBottom";
import {
  getPassword,
  getStockIDStorage,
  getUser,
} from "../../../constants/user";
import staffService from "../../../service/staff.service";
import moment from "moment";
import "moment/locale/vi";
import PageNoData from "../../../components/PageNoData";
import SkeletonService from "./skeleton/SkeletonService";
import { groupbyTIME } from "../../../constants/format";
moment.locale("vi");
export default class employeeService extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoading: true,
      loadingSubmit: false,
      sheetOpened: false,
      messageForce: false,
      showPreloader: false,
      keyword: "",
      startDate: "",
      endDate: "",
      arrDefaultDate: [],
    };
  }

  componentDidMount() {
    const formData = {
      cmd: "member_sevice",
      IsManager: 1,
      IsService: 1,
      MemberIDs: "",
      srv_status: "book,wait_book,wait,doing,done,cancel",
      srv_from: moment().format("l"),
      srv_to: moment().format("l"),
      key: "",
      ps: 1000,
    };
    this.getService(formData);
  }

  getService = (data) => {
    if (!getUser()) return false;
    const infoMember = getUser();
    const user = {
      USN: infoMember.UserName,
      PWD: getPassword(),
      StockID: getStockIDStorage(),
    };

    staffService
      .getServiceStaff(user, data)
      .then((response) => {
        const { data, mBook } = response.data;
        setTimeout(() => {
          this.setState({
            arrService: groupbyTIME(data, "BookDate"),
            mBook: groupbyTIME(mBook, "BookDate"),
            isLoading: false,
          });
        }, 200);
      })
      .catch((err) => console.log(err));
  };

  checkStatus = (status) => {
    switch (status) {
      case "done":
        return (
          <span className="label-inline label-light-success">Ho??n th??nh</span>
        );
      case "doing":
        return (
          <span className="label-inline label-light-warning">
            ??ang th???c hi???n
          </span>
        );
      default:
        return (
          <span className="label-inline label-light-info">Ch??a th???c hi???n</span>
        );
    }
  };

  checkStatusBook = (item) => {
    switch (item?.Status) {
      case "KHACH_KHONG_DEN":
        return (
          <span className="label-inline label-light-success">
            Kh??ch kh??ng ?????n {item?.Member?.MobilePhone !== "0000000000" && <>{item?.Member.IsAnonymous && "- Kh??ch v??ng lai"} {item?.IsNew && "- Kh??ch m???i"}</>}
          </span>
        );
      case "KHACH_DEN":
        return (
          <span className="label-inline label-light-warning">
            Kh??ch t???i {item?.Member?.MobilePhone === "0000000000" && <>{item?.Member.IsAnonymous && "- Kh??ch v??ng lai"} {item?.IsNew && "- Kh??ch m???i"}</>}
          </span>
        );
      default:
        return (
          <span className="label-inline label-light-info">
            ???? x??c nh???n {item?.Member?.MobilePhone === "0000000000" && <>{item?.Member.IsAnonymous && "- Kh??ch v??ng lai"} {item?.IsNew && "- Kh??ch m???i"}</>}
          </span>
        );
    }
  };

  handleDetail = (item) => {
    this.$f7router.navigate("/employee/service/" + item.ID + "/");
  };
  handleDiary = (item) => {
    this.$f7router.navigate("/employee/diary/" + item.MemberID + "/");
  };
  handleSchedule = (item) => {
    this.$f7router.navigate("/employee/schedule/" + item.OrderItemID + "/");
  };
  handleHistory = (item) => {
    this.$f7router.navigate(
      "/employee/history/" + item.OrderItemID + "/" + item.MemberID + "/"
    );
  };

  handleClickSv = (item) => {
    this.refs.actionService.open();
  };

  onChangeTextS = (evt) => {
    this.setState({
      keyword: evt.target.value,
    });
  };
  clearInput = () => {
    this.setState({
      keyword: "",
    });
  };
  onChangeDateS = (evt) => {
    const start = evt[0];
    const end = evt[1] ? evt[1] : evt[0];
    this.setState({
      startDate: moment(start).format("DD/MM/YYYY"),
      endDate: moment(end).format("DD/MM/YYYY"),
      arrDefaultDate: evt,
    });
  };

  onInputFocus = () => {
    this.setState({
      messageForce: false,
    });
  };

  openFilter = () => {
    this.setState({
      sheetOpened: true,
    });
  };

  closeSheet = () => {
    this.setState({
      sheetOpened: false,
    });
  };

  searchSubmit = async () => {
    const { startDate, endDate, keyword } = this.state;
    this.setState({
      loadingSubmit: true,
      isLoading: true,
    });
    const formData = {
      cmd: "member_sevice",
      IsManager: 1,
      IsService: 1,
      MemberIDs: "",
      srv_status: "book,wait_book,wait,doing,done,cancel",
      srv_from: startDate ? startDate : moment().format("l"),
      srv_to: endDate ? endDate : moment().format("l"),
      key: keyword,
      ps: 1000,
    };
    const result = await this.getService(formData);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    this.setState({
      loadingSubmit: false,
      sheetOpened: false,
      isLoading: false,
    });
  };

  async loadRefresh(done) {
    const { startDate, endDate, keyword } = this.state;
    const formData = {
      cmd: "member_sevice",
      IsManager: 1,
      IsService: 1,
      MemberIDs: "",
      srv_status: "book,wait_book,wait,doing,done,cancel",
      srv_from: startDate || moment().format("l"),
      srv_to: endDate || moment().format("l"),
      key: keyword || "",
      ps: 1000,
    };

    await this.getService(formData);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    done();
  }

  render() {
    const {
      arrService,
      mBook,
      isLoading,
      loadingSubmit,
      sheetOpened,
      messageForce,
      arrDefaultDate,
    } = this.state;
    return (
      <Page
        name="employee-service"
        onPtrRefresh={this.loadRefresh.bind(this)}
        ptr
        infiniteDistance={50}
      >
        <Navbar>
          <div className="page-navbar">
            <div className="page-navbar__back">
              <Link onClick={() => this.openFilter()}>
                <i className="las la-filter"></i>
              </Link>
            </div>
            <div className="page-navbar__title">
              <span className="title">
                D???ch V???{" "}
                {arrService &&
                  arrService.length > 0 &&
                  `(${arrService.length})`}
              </span>
            </div>
            <div className="page-navbar__noti">
              <NotificationIcon />
            </div>
          </div>
          <Subnavbar className="cardservice-tab-head">
            <div className="cardservice-title">
              <Link noLinkClass className="w-50" tabLink="#sv" tabLinkActive>
                D???ch v???
              </Link>
              <Link noLinkClass className="w-50" tabLink="#book">
                ?????t l???ch
              </Link>
            </div>
          </Subnavbar>
        </Navbar>
        <div className="page-render employee-service p-0">
          <Tabs animated>
            <Tab id="sv" tabActive>
              <div className="employee-service__list">
                {isLoading && <SkeletonService />}
                {!isLoading && arrService && (
                  <>
                    {arrService.length > 0 ? (
                      arrService.map((item, index) => (
                        <div key={index}>
                          <div className="item">
                            <h3>
                              {this.checkStatus(item.Status)}
                              {item.Title}
                            </h3>
                            <ul>
                              <li>
                                <span>Kh??ch h??ng : </span>
                                <span>{item.member.FullName}</span>
                              </li>
                              <li>
                                <span>Ng??y ?????t l???ch : </span>
                                <span>{moment(item.BookDate).format("L")}</span>
                              </li>
                              <li>
                                <span>Gi??? ?????t l???ch : </span>
                                <span>
                                  {moment(item.BookDate).format("LT")}
                                </span>
                              </li>
                              <li>
                                <span>S??? ph??t : </span>
                                <span>{item.RootMinutes}p/Ca</span>
                              </li>
                            </ul>
                            <Button
                              noClassName
                              raised={true}
                              actionsOpen={`#actions-group-${item.ID}`}
                            ></Button>
                          </div>
                          <Actions
                            className="actions-custom"
                            id={`actions-group-${item.ID}`}
                          >
                            <ActionsGroup>
                              <ActionsLabel>{item.Title}</ActionsLabel>
                              <ActionsButton
                                onClick={() => this.handleDetail(item)}
                              >
                                Xem chi ti???t
                              </ActionsButton>
                              <ActionsButton
                                onClick={() => this.handleDiary(item)}
                              >
                                Nh???t k??
                              </ActionsButton>
                              <ActionsButton
                                onClick={() => this.handleSchedule(item)}
                              >
                                L???ch tr??nh
                              </ActionsButton>
                              <ActionsButton
                                onClick={() => this.handleHistory(item)}
                              >
                                L???ch s??? kh??ch h??ng
                              </ActionsButton>
                            </ActionsGroup>
                            <ActionsGroup>
                              <ActionsButton color="red">????ng</ActionsButton>
                            </ActionsGroup>
                          </Actions>
                        </div>
                      ))
                    ) : (
                      <PageNoData text="B???n kh??ng c?? l???ch d???ch v??? !" />
                    )}
                  </>
                )}
              </div>
            </Tab>
            <Tab id="book">
              <div className="employee-service__list">
                {isLoading && <SkeletonService />}
                {!isLoading && mBook && (
                  <>
                    {mBook.length > 0 ? (
                      mBook.map((item, index) => (
                        <div key={index}>
                          <div className="item">
                            <h3>
                              {this.checkStatusBook(item)}
                              {item.RootTitles} {item.AtHome && "- T???i nh??"}
                            </h3>
                            <ul>
                              <li>
                                <span>Kh??ch h??ng : </span>
                                <span>
                                  {item?.FullName || item?.Member?.FullName}
                                </span>
                              </li>
                              <li>
                                <span>S??? ??i???n tho???i : </span>
                                <span>
                                  {item?.Phone ||
                                    item?.Member?.MobilePhone ||
                                    "Kh??ng c??"}
                                </span>
                              </li>
                              <li>
                                <span>C?? s??? : </span>
                                <span>{item.Stock.Title}</span>
                              </li>
                              <li>
                                <span>Ng??y ?????t l???ch : </span>
                                <span>{moment(item.BookDate).format("L")}</span>
                              </li>
                              <li>
                                <span>Gi??? ?????t l???ch : </span>
                                <span>
                                  {moment(item.BookDate).format("LT")}
                                </span>
                              </li>
                              <li className="w-100 p-0">
                                <span>Ghi ch?? : </span>
                                <span>{item.Desc || "Kh??ng c??"}</span>
                              </li>
                            </ul>
                            {!item?.Member?.IsAnonymous && (
                              <Button
                                noClassName
                                raised={true}
                                actionsOpen={`#actions-group-${item.ID}`}
                              ></Button>
                            )}
                          </div>
                          <Actions
                            className="actions-custom"
                            id={`actions-group-${item.ID}`}
                          >
                            <ActionsGroup>
                              <ActionsLabel>{item.RootTitles}</ActionsLabel>
                              <ActionsButton
                                onClick={() => this.handleDetail(item)}
                              >
                                Xem chi ti???t
                              </ActionsButton>
                              <ActionsButton
                                onClick={() => this.handleDiary(item)}
                              >
                                Nh???t k??
                              </ActionsButton>
                              <ActionsButton
                                onClick={() => this.handleHistory(item)}
                              >
                                L???ch s??? kh??ch h??ng
                              </ActionsButton>
                            </ActionsGroup>
                            <ActionsGroup>
                              <ActionsButton color="red">????ng</ActionsButton>
                            </ActionsGroup>
                          </Actions>
                        </div>
                      ))
                    ) : (
                      <PageNoData text="B???n kh??ng c?? l???ch d???ch v??? !" />
                    )}
                  </>
                )}
              </div>
            </Tab>
          </Tabs>
        </div>

        <Sheet
          className="sheet-swipe-product sheet-swipe-employee"
          style={{ height: "auto", "--f7-sheet-bg-color": "#fff" }}
          opened={sheetOpened}
          onSheetClosed={() => this.closeSheet()}
          swipeToClose
          swipeToStep
          backdrop
        >
          <div className="sheet-modal-swipe-step">
            <div className="sheet-modal-swipe__close"></div>
            <div className="sheet-swipe-product__content">
              <div className="sheet-pay-body">
                <div className="sheet-pay-body__form">
                  <ul>
                    <ListInput
                      label="T??n d???ch v???"
                      type="text"
                      placeholder="T??m theo t??n d???ch v???"
                      clearButton
                      onChange={this.onChangeTextS}
                      onFocus={this.onInputFocus}
                      onInputClear={this.clearInput}
                      errorMessage="Vui l??ng nh???p t??? kh??a ho???c ch???n ng??y c???n t??m ki???m."
                      errorMessageForce={messageForce}
                    />
                    <ListInput
                      label="Ch???n ng??y"
                      type="datepicker"
                      placeholder="Ng??y b???t ?????u - Ng??y k???t th??c"
                      value={arrDefaultDate}
                      readonly
                      calendarParams={{
                        dateFormat: "dd/mm/yyyy",
                        rangePicker: true,
                        footer: true,
                        toolbarCloseText: "X??c nh???n",
                        backdrop: true,
                      }}
                      clearButton
                      onCalendarChange={this.onChangeDateS}
                    />
                  </ul>
                </div>
                <div className="sheet-pay-body__btn">
                  <button
                    className={`page-btn-order btn-submit-order ${
                      loadingSubmit && "loading"
                    }`}
                    onClick={() => this.searchSubmit()}
                  >
                    <span>T??m d???ch v???</span>
                    <div className="loading-icon">
                      <div className="loading-icon__item item-1"></div>
                      <div className="loading-icon__item item-2"></div>
                      <div className="loading-icon__item item-3"></div>
                      <div className="loading-icon__item item-4"></div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Sheet>

        <Toolbar tabbar position="bottom">
          <ToolBarBottom />
        </Toolbar>
      </Page>
    );
  }
}
