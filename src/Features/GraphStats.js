import { DashboardWidgetLayout, Divider, FlexLayout, StackingLayout, Title } from "@nutanix-ui/prism-reactjs";
import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from '@nutanix-ui/recharts';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from "react";

const GraphStats = forwardRef((props,ref) => {

  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(false);

  const getData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/changes/graphStats/${props.userId}?startDate=${props.startDate.format('YYYY-MM-DD')}&endDate=${props.endDate.format('YYYY-MM-DD')}`);
      if(response.status<300){
        const data = await response.json();
        setUserData([data]);
      }else{
        throw new Error('Error while fetching graph data.');
      }
    } catch (error) {
      props.handleSuccessOrFailure(false, 'Error while fetching graph data');
      props.handleClose();
    }  
    setLoading(false);
  }, [props.startDate, props.endDate])

  useImperativeHandle(ref, () => ({
    getData,
  }));

  useEffect(()=>{
    getData();
  },[]);

  const chartData = () => {
    if(userData && userData[0]){
      const data = [
        {
          name: "Mon",
          reviews: userData[0].reviewsByday["1"] || 0
        },
        {
          name: "Tues",
          reviews: userData[0].reviewsByday["2"] || 0
        },
        {
          name: "Wed",
          reviews: userData[0].reviewsByday["3"] || 0
        },
        {
          name: "Thurs",
          reviews: userData[0].reviewsByday["4"] || 0
        },
        {
          name: "Fri",
          reviews: userData[0].reviewsByday["5"] || 0
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

  return (
    <StackingLayout>
      <FlexLayout padding="10px" itemSpacing="20px">
        <Title size='h3'>Reviews By Day of Week</Title>
      </FlexLayout>
      <Divider />
      <DashboardWidgetLayout 
        bodyContent = {reviewChart}
        loading={loading}
        footer={null}
        bodyContentProps={{itemFlexBasis: '100pc'}}
        style={{flexBasis:'100%', width: '100%'}}
        itemSpacing='0px'
      />
    </StackingLayout>
  );

});

export default GraphStats;