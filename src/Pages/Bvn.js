import { useEffect, useState } from 'react';
import Api from '../Services/Api';
import { getUserDetails } from '../Services/UserToken';
import Loading from '../Component/Loading';


const Bvn = () => {
  const [ loading, setLoading ] = useState(false);
  const [ filtered, setFiltered ] = useState(false);
  const [ search, setSearch ] = useState('');
  const [ allBvn, setAllBvn ] = useState([]);
  const [ page, setPage ] = useState(1);
  const [ pagedBvn, setPagedBvn ] = useState([]);

  useEffect(() => {
    setLoading(true);

    Api()
      .get("/admins/user/not_verify_bvn")
      .then(function (response) {
        // handle success
        console.log(response.data.data);
        setAllBvn(response.data.data);
        setPagedBvn(response.data.data.slice(0, 100));
        setLoading(false)
      })
      .catch(function (error) {
        // handle error
        console.log(error);
        setLoading(false)
      })
      .then(function () {
        // always executed
      });
      //console.log(getUserDetails() ? getUserDetails().id: 'Unauthenticated');
  }, []);

  const paginateData = (dir) => {
    if (dir === 'down' && pagedBvn[0] !== allBvn[0]) {
      setPagedBvn(allBvn.slice(page - 101, page - 1));
      setPage(page - 100);
    }

    if (dir === 'up' && pagedBvn[pagedBvn.length - 1] !== allBvn[allBvn.length -1]) {
      setPagedBvn(allBvn.slice(page + 99, page + 199));
      setPage(page + 100);
    }
  }

  const approveBvn = (evt, action) => {
    console.log(evt.target.name);
    //console.log(sessionStorage.getItem("SokashAdminuser"));
    //return;

    let confirmAction = window.confirm('Are you sure you want to perform this action?');
    if (!confirmAction) return;
    //return console.log(getUserDetails())

    setLoading(true);
    //const token = getToken();
    const data = {
      action: action,
      admin_id: getUserDetails().id,
      user_id: parseInt(evt.target.name)
    };
    //console.log(data);
    //console.log(token);

    Api().post("/admin/approved_or_dis_approved/bvn", data)
    .then(function (response) {
      // handle success
      console.log(response.data);
      setLoading(false);
      if (response.data && response.data.success === true) {
        window.alert('Action was successful!');
        window.location.reload();
      }
    })
    .catch(function (error) {
      // handle error
      console.log(error.message);
      setLoading(false);
    });
  }
  
  const filterData = (evt) => {
    evt.preventDefault();
    setLoading(true);
    const fullName = search.split(' ');
    let allUsersData = [...allBvn];
    let filteredUsersData = [];
    console.log(fullName); //return;
    for(let a = 0; a < allUsersData.length; a ++) {
      if (fullName.length === 1 && allUsersData[a].last_name) {
        if (allUsersData[a].last_name.toLowerCase().includes(fullName[0].toLowerCase())) {
          filteredUsersData.push(allUsersData[a]);
        }
      }
      
      if (fullName.length === 2 && allUsersData[a].last_name && allUsersData[a].first_name) {
        if (allUsersData[a].last_name.toLowerCase().includes(fullName[0].toLowerCase())
        && allUsersData[a].first_name.toLowerCase().includes(fullName[1].toLowerCase())) {
          filteredUsersData.push(allUsersData[a]);
        }
      }
      
      if (fullName.length === 3
        && allUsersData[a].last_name
        && allUsersData[a].first_name
        && allUsersData[a].others_name) {
        if (allUsersData[a].last_name.toLowerCase().includes(fullName[0].toLowerCase())
        && allUsersData[a].first_name.toLowerCase().includes(fullName[1].toLowerCase())
        && allUsersData[a].others_name.toLowerCase().includes(fullName[2].toLowerCase())) {
          filteredUsersData.push(allUsersData[a]);
        }
      }
    }

    setPagedBvn(filteredUsersData);
    setLoading(false);
    setFiltered(true);
  }

  const clearFilterData = () => {
    setPagedBvn(allBvn.slice(0, 100));
    setPage(1);
    setFiltered(false);
    setSearch('');
  }

  const Paginator = () => {
    return <div style={{display: 'flex', justifyContent: 'flex-end'}}>
      <div style={{backgroundColor: '#c3dacf', borderRadius: 10}}>
        <button
          onClick={() => paginateData('down')}
          style={{
            backgroundColor: '#007945',
            border: '1px solid #007945',
            borderTopLeftRadius: 10,
            borderBottomLeftRadius: 10,
            color: '#fff',
            cursor: 'pointer',
            padding: 10
          }}
        >
          {'<'}
        </button>
        <span style={{ color: '#000', padding: 10}}>
          Showing&nbsp;
          {
            page.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' - '
            + (pagedBvn.indexOf(pagedBvn[pagedBvn.length - 1]) + page)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            + ' of ' + allBvn.length.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
        </span>
        <button
          onClick={() => paginateData('up')}
          style={{
            backgroundColor: '#007945',
            border: '1px solid #007945',
            borderTopRightRadius: 10,
            borderBottomRightRadius: 10,
            color: '#fff',
            cursor: 'pointer',
            padding: 10
          }}
        >
          {'>'}
        </button>
      </div>
    </div>
  }

  return (
    <div id="bvn">
      <div id="b-tabs">
        <span className="dashboardtitle" style={{fontSize: 'xx-large'}}>
          Unverified BVN
        </span>
      </div>
      { loading && <Loading />  }
      <div id="b-table">
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            margin: '10px 0',
            padding: 10
          }}
        >
          <div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by names"
              style={{border: '1px solid gray', borderRadius: 6, marginBottom: 7, padding: 10}}
            />
            <button
              onClick={(e) => filterData(e)}
              style={{
                backgroundColor: '#007945',
                border: '1px solid #007945',
                borderRadius: 6,
                color: '#fff',
                cursor: 'pointer',
                marginBottom: 7,
                marginLeft: 5,
                padding: '10px 20px'
              }}
            >
              Filter
            </button>
            <button
              onClick={(e) => clearFilterData(e)}
              style={{
                border: '1px solid gray',
                borderRadius: 6,
                cursor: 'pointer',
                marginLeft: 5,
                marginBottom: 7,
                padding: '10px 20px'
              }}
            >
              Cancel
            </button>
            <div style={{color: '#007945', fontSize: 12}}>
            <b>Format: "Surname FirstName"<br/><i>E.g. type&nbsp;
              <font style={{color: '#000'}}>Smith</font> or&nbsp;
              <font style={{color: '#000'}}>Smith John</font>.</i></b>
            </div>
          </div>
          {
            !filtered && <div style={{marginBottom: 7}}>
              <Paginator />
            </div>
          }
        </div>
        <table cellPadding="0" cellSpacing="0">
          <thead style={{textAlign:'left'}}>
            <tr>
              <th>Index</th>
              <th>Full name</th>
              <th>Email</th>
              <th>BVN</th>
              <th>Phone number</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {
              pagedBvn.length > 0 && pagedBvn.map((b, i) => {
                return <tr key={b.id} id={b.id}>
                  <td>{i + page}</td>
                  <td>
                    {
                      (b.last_name ? b.last_name: '') + ' '
                      + (b.first_name ? b.first_name: '') + ' '
                      + (b.others_name ? b.others_name: '')
                    }
                  </td>
                  <td>{b.email}</td>
                  <td>{b.bvn}</td>
                  <td>{b.phone_number}</td>
                  <td>
                    <button
                      name={b.id}
                      onClick={ (e) => approveBvn(e, 'approve') }
                      className="btn_okay"
                    >
                      Approve
                    </button>
                    <button
                      name={b.id}
                      onClick={ (e) => approveBvn(e, 'dis-approve') }
                      className="btn_warning"
                    >
                      Disapprove
                    </button>
                  </td>
                </tr>
              })
            }
          </tbody>
        </table>
        <div style={{marginTop: 20}}>
          <Paginator />
        </div>
      </div>
    </div>
  );
}

export default Bvn;
