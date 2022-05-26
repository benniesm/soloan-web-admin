import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Paper, Button } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Api from "../Services/Api";
import LoadingTable from "./LoadingTable";
import Loading from './Loading';
import {setUsersNo} from "../Services/UserToken";
const useStyles = makeStyles({
  root: {
    width: "100%",
    boxShadow: "0px 4px 12px rgba(35, 209, 35, 0.31)",
    borderRadius: "20px",
  },
  container: {
    maxHeight:540,
  },
});

export default function UserTable(props) {
  const classes = useStyles();
  //const [, setPage] = React.useState(0);
  //const [, setRowsPerPage] = React.useState(10);
  const [loading, setloading] = useState(false)
  const [ busy, setBusy ] = useState(false);
  const [ search, setSearch ] = useState('');
  const [LoanData, setLoanData] = useState([]);
  const [ pagedLoanData, setPagedLoanData ] = useState([]);
  const [ page, setPage ] = useState(1);
  const [ filtered, setFiltered ] = useState(false);
  const [url, seturl] =useState(props.url || "")
  const [action, setaction] = useState(props.action || false)
  const [buttontext, setbuttontext] = useState(props.buttontext || "")

  useEffect(() => {
    seturl(props.url);
    setaction(props.action);
    
    const getLoanData = () => {
      setloading(true)
      Api()
        .get(url)
        .then(function (response) {
          // handle success
          console.log(response.data.data);
          setLoanData(response.data.data);
          setPagedLoanData(response.data.data.slice(0, 100));
          setUsersNo(response.data.data.length)
          setloading(false)
        })
        .catch(function (error) {
          // handle error
          console.log(error);
          setloading(false)
        })
        .then(function () {
          // always executed
        });
    };
    getLoanData();
  }, [props, url]);

  var formatter = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",

    // These options are needed to round to whole numbers if that's what you want.
    //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
  });

  const paginateData = (dir) => {
    if (dir === 'down' && pagedLoanData[0] !== LoanData[0]) {
      setPagedLoanData(LoanData.slice(page - 101, page - 1));
      setPage(page - 100);
    }

    if (dir === 'up' && pagedLoanData[pagedLoanData.length - 1] !== LoanData[LoanData.length -1]) {
      setPagedLoanData(LoanData.slice(page + 99, page + 199));
      setPage(page + 100);
    }
  }
  
  const filterData = (evt) => {
    evt.preventDefault();
    setBusy(true);
    const fullName = search.split(' ');
    let allUsersData = [...LoanData];
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

    setPagedLoanData(filteredUsersData);
    setBusy(false);
    setFiltered(true);
  }

  const clearFilterData = () => {
    setPagedLoanData(LoanData.slice(0, 100));
    setPage(1);
    setFiltered(false);
    setSearch('');
  }

  const Paginator = () => {
    return <div style={{display: 'flex', justifyContent: 'flex-end'}}>
      <div style={{backgroundColor: '#c3dacf', borderRadius: 10, display: 'inline-block', whiteSpace: 'nowrap'}}>
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
        <span style={{ color: '#000', padding: 10, whiteSpace: 'nowrap'}}>
          Showing&nbsp;
          {
            page.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' - '
            + (pagedLoanData.indexOf(pagedLoanData[pagedLoanData.length - 1]) + page)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            + ' of ' + LoanData.length.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
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
    <Paper className={classes.root}>
      { busy && <Loading />  }
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
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell align="center">S/N</TableCell>
              <TableCell align="center">Name</TableCell>
              <TableCell align="center">Email</TableCell>
              <TableCell align="center">Phone No.</TableCell>
              <TableCell align="center">Ledger Balances</TableCell>
              <TableCell align="center">Loan Balances</TableCell>
              <TableCell align="center">Referral Balances</TableCell>
              <TableCell align="center">Total Balances</TableCell>
              {/* <TableCell align="center">Wallet Status</TableCell> */}
              <TableCell align="center">Status</TableCell>
              {action && <TableCell align="center">Action</TableCell> }
            </TableRow>
          </TableHead>
          <TableBody>
            {pagedLoanData.map((rows, i) => (
              <TableRow key={i}>
                <TableCell component="th" scope="row">
                  {page+i}
                </TableCell>
                <TableCell component="th" scope="row">
                  {
                    (rows.last_name ? rows.last_name: '')
                    + (rows.first_name ? (' ' + rows.first_name): '')
                    + (rows.others_name ? (' ' + rows.others_name): '')
                    + (!rows.last_name && !rows.first_name && !rows.others_name ? '': '')
                  /*rows && rows.first_name + " " + rows.last_name
                    ? rows.first_name + " " + rows.last_name
                    : "Name is missing"*/
                  }
                </TableCell>
                <TableCell>
                  {rows.email && rows.email
                    ? rows.email
                    : "Email is missing"}
                </TableCell>
                <TableCell component="th" scope="row">
                    {rows.phone_number}
                </TableCell>
                <TableCell component="th" scope="row">
                   {rows.wallet && rows.wallet.ledger_balances
                    ? formatter.format(rows.wallet.ledger_balances)
                    : "0.00"}
                </TableCell>
                <TableCell component="th" scope="row">
                   {rows.wallet && rows.wallet.loan_credit_balance
                    ? formatter.format(rows.wallet.loan_credit_balance)
                    : "0.00"}
                </TableCell>
                <TableCell component="th" scope="row">
                   {rows.wallet && rows.wallet.referral_balances
                    ? formatter.format(rows.wallet.referral_balances)
                    : "0.00"}
                </TableCell>
                <TableCell component="th" scope="row">
                   {rows.wallet && rows.wallet.total_balances
                    ? formatter.format(rows.wallet.total_balances)
                    : "0.00"}
                </TableCell>
                {/* <TableCell component="th" scope="row">
                   {rows.wallet && rows.wallet.lock
                    ?  rows.wallet.lock ? (<Button variant="outlined" color="secondary">Lock</Button>) : (<Button variant="outlined" color="primary">Active</Button>)
                    : "Lock is missing"}
                </TableCell> */}
                <TableCell component="th" scope="row">
                    {rows.status ?(<Button variant="outlined" color="secondary">Lock</Button>) : (<Button variant="outlined" color="primary">Active</Button>)}
                </TableCell>
                {action && <TableCell component="th" scope="row">
                  {
                    <Button variant="contained" color="primary">
                     {buttontext}
                    </Button>
                  }
                </TableCell> }
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {
          !filtered && <div style={{marginTop: 20}}>
            <Paginator />
          </div>
        }
        <div>
            <br></br>
          {loading && <LoadingTable />}
        </div>  
      </TableContainer>
    </Paper>
  );
}
