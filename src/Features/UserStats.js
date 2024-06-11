import { Badge, Button, CloseIcon, ContainerLayout, DashboardWidgetHeader, DashboardWidgetLayout, DatePicker, Divider, FlexLayout, FullPageModal, Input, Link, Modal, StackingLayout, Table, TextLabel, Title } from '@nutanix-ui/prism-reactjs';
import { useCallback, useEffect, useState } from 'react';
import moment from 'moment';
import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from '@nutanix-ui/recharts';

const columns = [
  {
    title: "User Name",
    key: "userName"
  },
  {
    title: "CRs Raised",
    key: "changesCount"
  },
  {
    title: "+2 received",
    key: "plusTwoReceived"
  },
  {
    title: "+1 received",
    key: "plusOneReceived"
  },
  {
    title: "-1 received",
    key: "minusOneReceived"
  },
  {
    title: "-2 received",
    key: "minusTwoReceived"
  },
  {
    title: "Comments Recieved",
    key: "commentsRecieved"
  },
  {
    title: "Comments / Change",
    key: "commentsPerChange"
  },
  {
    title: "Added as Reviewer",
    key: "reviewCount"
  }, 
  {
    title: "+2 given",
    key: "plusTwoGiven"
  },
  {
    title: "+1 given",
    key: "plusOneGiven"
  },
  {
    title: "-1 given",
    key: "minusOneGiven"
  },
  {
    title: "-2 given",
    key: "minusTwoGiven"
  }
]

const oldestChangesColumns = [
  {
    title: "Gerrit URL",
    key: "url"
  },
  {
    title: "Created On",
    key: "createdOn"
  }
]

const maxCommentsColumns = [
  {
    title: "Gerrit URL",
    key: "url"
  },
  {
    title: "Comments",
    key: "comments"
  }
]

const longestAndShortestColumns = [
  {
    title: "Gerrit URL",
    key: "url"
  },
  {
    title: "Time",
    key: "time"
  }
]

const header = (
  <DashboardWidgetHeader title="Gerrit Statistics" showCloseIcon={ false } />
);


function UserDetails(props) {

  const userId = props.userDetails._account_id;

  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(false);  
  const [startDate, setStartDate] = useState(moment().subtract(1, 'weeks'));
  const [endDate, setEndDate] = useState(moment().startOf('day')); 

  const getData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/changes/${userId}?startDate=${startDate.format('YYYY-MM-DD')}&endDate=${endDate.format('YYYY-MM-DD')}`);
      if(response.status < 300){
        props.handleSuccessOrFailure(true, 'User statistics fetched successfully');
        const data = await response.json();
        setUserData([data]);
      }else{
        throw new Error('Error while fetching user statistics.');
      }
    } catch (error) {
      props.handleSuccessOrFailure(false, 'Error while fetching user statistics');
      props.handleClose();
    }
    setLoading(false);
  }, [startDate,endDate])

  useEffect(()=>{
    getData();
  },[])

  const [changesModal, setChangesModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalData, setModalData] = useState([]);

  const handleModalClose = () => {
    setChangesModal(false);
    setModalTitle('');  
    setModalData([]);
  }

  const getDataSource = () => {
    if(userData){
      let data =  userData.map((data) => {
  
        return {
          key: data.userId,
          userName: props.userDetails.name,
          changesCount: data.ownChangesCount,
          reviewCount: data.addedAsReviewer,
          commentsRecieved: <Button type={Button.ButtonTypes.TEXT_NORMAL} onClick={() => {
            setChangesModal(true);
            setModalTitle('Comments Received');
            setModalData(data.comments.changes)
          }}>{data.comments.total}</Button>,
          commentsPerChange: parseFloat(data.commentsPerChange).toFixed(2),
          plusTwoGiven: <Badge  
            appearance={Badge.BadgeAppearance.DEFAULT}
            color='green' 
            count={data.reviewedChanges.plusTwos.length}
            type={Badge.BadgeTypes.TAG}  
            overflowCount={1000}
            onClick={() => {
              setChangesModal(true);
              setModalTitle('Changes with +2 given');
              setModalData(data.reviewedChanges.plusTwos)
            }}
          />,
          plusOneGiven: <Badge  
          appearance={Badge.BadgeAppearance.DEFAULT}
          color='green' 
          count={data.reviewedChanges.plusOnes.length}
          type={Badge.BadgeTypes.TAG}  
          overflowCount={1000}
          onClick={() => {
            setChangesModal(true);
            setModalTitle('Changes with +1 given');
            setModalData(data.reviewedChanges.plusOnes)
          }}
        />,
          minusOneGiven: <Badge  
          appearance={Badge.BadgeAppearance.DEFAULT}
          color='red' 
          count={data.reviewedChanges.minusOnes.length}
          type={Badge.BadgeTypes.TAG}
          overflowCount={1000}
          onClick={() => {
            setChangesModal(true);
            setModalTitle('Changes with -1 given');
            setModalData(data.reviewedChanges.minusOnes)
          }}
        />,
          minusTwoGiven: <Badge  
          appearance={Badge.BadgeAppearance.DEFAULT}
          color='red' 
          count={data.reviewedChanges.minusTwos.length}
          type={Badge.BadgeTypes.TAG}  
          overflowCount={1000}
          onClick={() => {
            setChangesModal(true);
            setModalTitle('Changes with -2 given');
            setModalData(data.reviewedChanges.minusTwos)
          }}
        />,
          plusTwoReceived: <Badge  
          appearance={Badge.BadgeAppearance.DEFAULT}
          color='green' 
          count={data.reviews.plusTwos.length}
          type={Badge.BadgeTypes.TAG}
          overflowCount={1000}
          onClick={() => {
            setChangesModal(true);
            setModalTitle('Changes with +2 received');
            setModalData(data.reviews.plusTwos)
          }}
        />,
          plusOneReceived: <Badge  
          appearance={Badge.BadgeAppearance.DEFAULT}
          color='green' 
          count={data.reviews.plusOnes.length}
          type={Badge.BadgeTypes.TAG}  
          overflowCount={1000}
          onClick={() => {
            setChangesModal(true);
            setModalTitle('Changes with +1 received');
            setModalData(data.reviews.plusOnes)
          }}
        />,
          minusOneReceived: <Badge  
          appearance={Badge.BadgeAppearance.DEFAULT}
          color='red' 
          count={data.reviews.minusOnes.length}
          type={Badge.BadgeTypes.TAG}  
          overflowCount={1000}
          onClick={() => {
            setChangesModal(true);
            setModalTitle('Changes with -1 received');
            setModalData(data.reviews.minusOnes)
          }}
        />,
          minusTwoReceived: <Badge  
          appearance={Badge.BadgeAppearance.DEFAULT}
          color='red' 
          count={data.reviews.minusTwos.length}
          type={Badge.BadgeTypes.TAG}  
          overflowCount={1000}
          onClick={() => {
            setChangesModal(true);
            setModalTitle('Changes with -2 received');
            setModalData(data.reviews.minusTwos)
          }}
        />
        }
      });
      return data;
    }else{
      return [];
    }
  }

  const tableSection = (
    <FlexLayout padding="0px-10px" style={{width:"100%"}}>
      <Table
        showCustomScrollbar = {true}
        border = {false}
        rowKey="key"
        dataSource={ getDataSource() }
        columns={ columns } 
        wrapperProps={{
          'data-test-id': 'borderless'
        }}
        customMessages={{
          noData: 'No data found'
        }}
      />
    </FlexLayout>
  );

  const oldestChangesData = () => {
    if(userData && userData[0] && userData[0]['oldestOpenChanges']){
      let data = userData[0].oldestOpenChanges.map((item)=> {
        const localDate = new Date(item.created);
        return {
          id: item.id,
          url: <Link style={{color:'#22a5f7'}} data-test-id="inline-with-href" type="inline" href={item.url}>{item.url}</Link>,
          createdOn: localDate.toString()
        }
      });
      return data;
    } else {
      return [];
    }
  }

  const oldestChangesTable = (
    <FlexLayout padding="0px-10px" style={{width:"100%"}}>
      <Table
        showCustomScrollbar = {true}
        border = {false}
        rowKey="id"
        dataSource={ oldestChangesData() }
        columns={ oldestChangesColumns } 
        wrapperProps={{
          'data-test-id': 'borderless'
        }}
        customMessages={{
          noData: 'No open changes'
        }}
      />
    </FlexLayout>
  );

  const mostCommentsData = () => {
    if(userData && userData[0] && userData[0]['maxComments'] && userData[0].maxComments.id){
      let maxComments = userData[0].maxComments;
      return [{
        id: maxComments.id,
        url: <Link style={{color:'#22a5f7'}} data-test-id="inline-with-href" type="inline" href={maxComments.url}>{maxComments.url}</Link>,
        comments: maxComments.count
      }]
    }else{
      return [];
    }
  }

  const mostCommentstable = (
    <FlexLayout padding="0px-10px" style={{width:"100%"}}>
      <Table
        showCustomScrollbar = {true}
        border = {false}
        rowKey="id"
        dataSource={ mostCommentsData() }
        columns={ maxCommentsColumns } 
        wrapperProps={{
          'data-test-id': 'borderless'
        }}
        customMessages={{
          noData: 'No changes'
        }}
      />
    </FlexLayout>
  )

  const longestAndShortestData = () => {
    if(userData && userData[0] && userData[0]['longestAndShortest']){
      let longest = userData[0].longestAndShortest.longest;
      let shortest = userData[0].longestAndShortest.shortest;
      if(!longest.id && !shortest.id){
        return [];
      }
      return [
        {
          id: longest.id,
          url: <Link style={{color:'#22a5f7'}} data-test-id="inline-with-href" type="inline" href={longest.url}>{longest.url}</Link>,
          time: longest.time
        },
        {
          id: shortest.id,
          url: <Link style={{color:'#22a5f7'}} data-test-id="inline-with-href" type="inline" href={shortest.url}>{shortest.url}</Link>,
          time: shortest.time
        }
      ]
    }else{
      return [];
    }
  }  

  const longestAndShortestTable = (
    <FlexLayout padding="0px-10px" style={{width:"100%"}}>
      <Table
        showCustomScrollbar = {true}
        border = {false}
        rowKey="id"
        dataSource={ longestAndShortestData() }
        columns={ longestAndShortestColumns } 
        wrapperProps={{
          'data-test-id': 'borderless'
        }}
        customMessages={{
          noData: 'No changes merged'
        }}
      />
    </FlexLayout>
  )

  const chartData = () => {
    if(userData && userData[0]){
      const data = [
        {
          name: "Mon",
          reviews: userData[0].reviewedChanges.reviewsByday["1"] || 0
        },
        {
          name: "Tues",
          reviews: userData[0].reviewedChanges.reviewsByday["2"] || 0
        },
        {
          name: "Wed",
          reviews: userData[0].reviewedChanges.reviewsByday["3"] || 0
        },
        {
          name: "Thurs",
          reviews: userData[0].reviewedChanges.reviewsByday["4"] || 0
        },
        {
          name: "Fri",
          reviews: userData[0].reviewedChanges.reviewsByday["5"] || 0
        }
      ]
      return data;
    } else {
      return null;
    }
  }

  const reviewChart = (
    <FlexLayout padding="0px-10px" style={{width:"100%"}} justifyContent='center' alignItems='center'>
      <BarChart
        width={ 500 }
        height={ 300 }
        data = {chartData()}
        margin={ {
          top: 5,
          right: 30,
          left: 20,
          bottom: 5
        } }
      >
        <CartesianGrid />
        <XAxis dataKey="name" interval={ 0 }/>
        <YAxis />
        <Tooltip  />
        <Legend />
        <Bar dataKey="reviews" minPointSize={ 10 }/>
      </BarChart>
    </FlexLayout>
  );

  const bodyContent = (
    <StackingLayout itemSpacing="0px">
      <Divider />
      {tableSection}
      <Divider />
      <FlexLayout itemSpacing="20px" padding="10px">
        <Title size='h3'>Reviews by Day of the Week</Title>
      </FlexLayout>
      <Divider />
      {reviewChart}
      <Divider />
      <FlexLayout itemSpacing="20px" padding="10px">
        <Title size='h3'>Open Changes</Title>
      </FlexLayout>
      <Divider />
      {oldestChangesTable}
      <Divider />
      <FlexLayout itemSpacing="20px" padding="10px">
        <Title size='h3'>Change with Most Comments</Title>
      </FlexLayout>
      <Divider />
      {mostCommentstable}
      <Divider />
      <FlexLayout itemSpacing="20px" padding="10px">
        <Title size='h3'>Changes with the Longest and Shortest Merge Times</Title>
      </FlexLayout>
      <Divider />
      {longestAndShortestTable}
    </StackingLayout>
  );

  return (
    <FullPageModal
      visible={true}
      title="User Gerrit Stats"
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
                onClick={getData}
                disabled={loading} 
              >
                Fetch
              </Button>
            </FlexLayout>
            {
              <DashboardWidgetLayout
                bodyContent = {bodyContent}
                footer={null}
                bodyContentProps={{itemFlexBasis: '100pc'}}
                style={{flexBasis:'100%', width: '100%'}}
                itemSpacing='0px'
                loading={loading}
              />
            }
          </FlexLayout>
        </ContainerLayout>
      </FlexLayout>
      <Modal
        visible={changesModal}
        title={modalTitle}
        onClose={handleModalClose}
        headerActions={[
          <Button
            key="save-btn"
            onClick={ handleModalClose }
            type={ Button.ButtonTypes.ICON_SECONDARY }
          >
            <CloseIcon key="close" />
          </Button>
        ]}
        footer={null}
      >
        <FlexLayout padding="0px-10px" style={{width:"100%"}}>
          <Table
            showCustomScrollbar = {true}
            border = {false}
            rowKey="id"
            dataSource={ modalData.map((item) => {
              return {
                ...item,
                url: <Link style={{color:'#22a5f7'}} data-test-id="inline-with-href" type="inline" target="_blank" href={item.url}>{item.url}</Link>
              }
            }) }
            columns={ [
              {
                title: "Changes URL",
                key: "url"
              }
            ] } 
            wrapperProps={{
              'data-test-id': 'borderless'
            }}
            customMessages={{
              noData: 'No ' + modalTitle.toLowerCase()
            }}
          />
        </FlexLayout>
      </Modal>
    </FullPageModal>
  );
}

export default UserDetails;
