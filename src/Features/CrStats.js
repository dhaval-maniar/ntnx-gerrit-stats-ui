import { Divider, FlexLayout, Link, StackingLayout, Table, Title } from "@nutanix-ui/prism-reactjs";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from "react";

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

const CrStats = forwardRef((props,ref) => {
  const [userData, setUserData] = useState([]); 
  const [loading, setLoading] = useState(false);

  const getData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/changes/crStats/${props.userId}?startDate=${props.startDate.format('YYYY-MM-DD')}&endDate=${props.endDate.format('YYYY-MM-DD')}`);
      if(response.status<300){
        const data = await response.json();
        setUserData([data]);
        console.log(data);
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
        loading={loading}
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
        loading={loading}
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

  return(
    <StackingLayout itemSpacing="0px">
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
  )
});

export default CrStats;