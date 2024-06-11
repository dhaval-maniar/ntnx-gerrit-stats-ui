import { Badge, Button, CloseIcon, FlexLayout, Link, Modal, Table } from "@nutanix-ui/prism-reactjs";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from "react";

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
];

const GerritStats = forwardRef((props,ref) => {

  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(false);

  const getData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/changes/stats/${props.userId}?startDate=${props.startDate.format('YYYY-MM-DD')}&endDate=${props.endDate.format('YYYY-MM-DD')}`);
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
  }, [props.startDate,props.endDate])

  useImperativeHandle(ref, () => ({
    getData,
  }));

  useEffect(()=>{
    getData();
  },[]);

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
          userName: props.name,
          changesCount: data.ownChangesCount,
          reviewCount: data.addedAsReviewer,
          commentsRecieved: <Button type={Button.ButtonTypes.TEXT_NORMAL} onClick={() => {
            setChangesModal(true);
            setModalTitle('Comments Received');
            setModalData(data.comments.changes)
          }}>{data.comments.total}</Button>,
          commentsPerChange: parseFloat(data.comments.total/(data.ownChangesCount ? data.ownChangesCount : 1)).toFixed(2),
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

  return (
    <FlexLayout padding="0px-10px" style={{width:"100%"}}>
      <Table
        showCustomScrollbar = {true}
        border = {false}
        rowKey="key"
        dataSource={ getDataSource() }
        loading={ loading}
        columns={ columns } 
        wrapperProps={{
          'data-test-id': 'borderless'
        }}
        customMessages={{
          noData: 'No data found'
        }}
      />
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
    </FlexLayout>
  );


})

export default GerritStats;