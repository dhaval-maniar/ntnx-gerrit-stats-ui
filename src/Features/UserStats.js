import { Button, CloseIcon, ContainerLayout, DashboardWidgetLayout, DatePicker, Divider, FlexLayout, FullPageModal, StackingLayout, Tabs, TextLabel } from '@nutanix-ui/prism-reactjs';
import { useRef, useState } from 'react';
import moment from 'moment';
import GerritStats from './GerritStats';
import CrStats from './CrStats';
import OpenChanges from './OpenChanges';
import GraphStats from './GraphStats';
import PendingReviews from './PendingReviews';

const data = [
  {
    title: "User Statistics",
    key: "userStats"
  },
  {
    title: "CR statistics",
    key: "crStats"
  },
  {
    title: "Open Changes",
    key: "openChanges"
  },
  {
    title: "Reviews by Filter",
    key: "reviewsByFilter"
  },
  {
    title: "Pending Reviews",
    key: "pendingReviews"
  }
]

function UserDetails(props) {

  const childRef = useRef();

  const [activeTab, setActiveTab] = useState("userStats");

  const userId = props.userDetails._account_id;

  const [startDate, setStartDate] = useState(moment().subtract(1, 'weeks'));
  const [endDate, setEndDate] = useState(moment().startOf('day')); 

  const handleTabClick = (tabKey) => {
    setActiveTab(tabKey);
  }

  function renderTabContent(tab){
    if(tab === "userStats"){
      return (
        <>
          <Divider />
            <GerritStats userId={userId} startDate={startDate} endDate={endDate} handleSuccessOrFailure={props.handleSuccessOrFailure} handleClose={props.handleClose} name={props.userDetails.name} ref={childRef} />
          <Divider />
        </>
      )
    }
    if(tab === "crStats"){
     return (
        <>
          <Divider />
            <CrStats userId={userId} startDate={startDate} endDate={endDate} handleSuccessOrFailure={props.handleSuccessOrFailure} handleClose={props.handleClose} name={props.userDetails.name} ref={childRef} />
          <Divider />
        </>
      )
    }
    if(tab === "openChanges"){
      return (
        <>
          <Divider />
            <OpenChanges userId={userId} startDate={startDate} endDate={endDate} handleSuccessOrFailure={props.handleSuccessOrFailure} handleClose={props.handleClose} name={props.userDetails.name} ref={childRef} />
          <Divider />
        </>
      )
    }
    if(tab === "reviewsByFilter"){
      return (
        <>
          <Divider />
            <GraphStats userId={userId} startDate={startDate} endDate={endDate} handleSuccessOrFailure={props.handleSuccessOrFailure} handleClose={props.handleClose} name={props.userDetails.name} ref={childRef} />
          <Divider />
        </>
      )
    }
    if(tab === "pendingReviews"){
      return (
        <>
          <Divider />
            <PendingReviews userId={userId} startDate={startDate} endDate={endDate} handleSuccessOrFailure={props.handleSuccessOrFailure} handleClose={props.handleClose} name={props.userDetails.name} ref={childRef} />
          <Divider />
        </>
      )
    }
  }

  const bodyContent = (
    <StackingLayout itemSpacing="0px">
      {renderTabContent(activeTab)}
    </StackingLayout>
  );

  const callGetData = () => {
    childRef.current.getData();
  }

  const title = `User Details for ${props.userDetails.name}`;

  return (
    <FullPageModal
      visible={true}
      title={title}
      headerActions={[
      <CloseIcon key="close" onClick={props.handleClose}/>
      ]}
    >
      <FlexLayout padding="20px" flexDirection='column' alignItems='center' justifyContent='center'>
        <ContainerLayout padding='10px' style={{width: "100%"}} border={true}>
          <FlexLayout padding="10px" flexDirection='column' alignItems='center' justifyContent='center'>
            <FlexLayout alignItems='flex-end'>
              <StackingLayout itemSpacing='5px'>
                <TextLabel>Start Date</TextLabel>
                <DatePicker
                  oldDatePicker={false}
                  inputProps={ { name:'datepicker-select-on-initial-render' } }
                  onChange={ (selectedDate) => setStartDate(selectedDate) }
                  defaultValue={startDate}
                  popupProviderProps={{
                    popupClassName: 'my-datepicker',
                    getPopupContainer: () => {
                      const container = document.querySelector(".right-panel");
                      return container || document.body;
                    }
                  }}
                />
              </StackingLayout>
              <StackingLayout itemSpacing='5px'>
                <TextLabel>End Date</TextLabel>
                <DatePicker
                  oldDatePicker={false}
                  inputProps={ { name:'datepicker-select-on-initial-render' } }
                  onChange={ (selectedDate) => setEndDate(selectedDate)}
                  defaultValue={endDate}
                  popupProviderProps={{
                    popupClassName: 'my-datepicker',
                    getPopupContainer: () => {
                      const container = document.querySelector(".right-panel");
                      return container || document.body;
                    }
                  }}
                />
              </StackingLayout>
              <Button
                onClick={callGetData}
              >
                Fetch
              </Button>
            </FlexLayout>
            <FlexLayout alignItems='flex-start' justifyContent='flex-start'>
              <Tabs
                data={data}
                onTabClick={handleTabClick}
                defaultActiveKey={activeTab}
                data-test-id="default-active"
              />
            </FlexLayout>
            {
              <DashboardWidgetLayout
                bodyContent = {bodyContent}
                footer={null}
                bodyContentProps={{itemFlexBasis: '100pc'}}
                style={{flexBasis:'100%', width: '100%'}}
                itemSpacing='0px'
              />
            }
          </FlexLayout>
        </ContainerLayout>
      </FlexLayout>
    </FullPageModal>
  );
}

export default UserDetails;
