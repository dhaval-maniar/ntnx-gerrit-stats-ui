import { Divider, FlexLayout, Link, StackingLayout, Table, Title } from "@nutanix-ui/prism-reactjs";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from "react";

const pendingReviewColumns = [
  {
    title: "Change Title",
    key: "url"
  },
]

const PendingReviews = forwardRef((props,ref) => {
  const [userData, setUserData] = useState([]); 
  const [loading, setLoading] = useState(false);

  const getData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/changes/pendingReviews/${props.userId}?startDate=${props.startDate.format('YYYY-MM-DD')}&endDate=${props.endDate.format('YYYY-MM-DD')}`);
      if(response.status<300){
        const data = await response.json();
        setUserData(data.pending);
      }else{
        throw new Error('Error while fetching CR statistics.');
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }, [props.startDate, props.endDate])

  useImperativeHandle(ref, () => ({
    getData,
  }));

  useEffect(()=>{
    getData();
  }, []);

  const pendingReviewData = () => {
    if(userData){
      let data = userData.map((item)=> {
        console.log(item);
        return {
          id: item.id,
          url: <Link style={{color:'#22a5f7'}} data-test-id="inline-with-href" type="inline" href={item.url}>{item.name}</Link>,
        }
      });
      return data;
    } else {
      return [];
    }
  }

  const pendingReviewsTable = (
    <FlexLayout padding="0px-10px"  style={{width:"100%"}}>
      <Table
        showCustomScrollbar = {true}
        border = {false}
        rowKey="id"
        dataSource={ pendingReviewData() }
        columns={ pendingReviewColumns } 
        loading={loading}
        wrapperProps={{
          'data-test-id': 'borderless'
        }}
        customMessages={{
          noData: 'No pending reviews'
        }}
      />
    </FlexLayout>
  );

  return(
    <StackingLayout>
      <FlexLayout itemSpacing="20px" padding="10px">
        <Title size='h3'>Pending Reviews</Title>
      </FlexLayout>
      <Divider />
      {pendingReviewsTable}
    </StackingLayout>
  )

});

export default PendingReviews;