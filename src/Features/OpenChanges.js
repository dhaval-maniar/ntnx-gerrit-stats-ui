import { Divider, FlexLayout, Link, StackingLayout, Table, Title } from "@nutanix-ui/prism-reactjs";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from "react";

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

const OpenChanges = forwardRef((props,ref) => {
  const [userData, setUserData] = useState([]); 
  const [loading, setLoading] = useState(false);

  const getData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/changes/openChanges/${props.userId}`);
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

  const oldestChangesData = () => {
    if(userData && userData[0]){
      let data = userData[0].map((item)=> {
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
        loading={loading}
        wrapperProps={{
          'data-test-id': 'borderless'
        }}
        customMessages={{
          noData: 'No open changes'
        }}
      />
    </FlexLayout>
  );

  return(
    <StackingLayout>
      <FlexLayout itemSpacing="20px" padding="10px">
        <Title size='h3'>Open Changes</Title>
      </FlexLayout>
      <Divider />
      {oldestChangesTable}
    </StackingLayout>
  )

});

export default OpenChanges;