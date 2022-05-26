import React, {useEffect, useState} from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Api from "../../Services/Api"
import { ShopTwo } from "@material-ui/icons";


const useStyles = makeStyles({
  root: {
    width: "100%",
    boxShadow: "0px 4px 12px rgba(35, 209, 35, 0.31)",
    borderRadius: "20px",
  },
  container: {
    maxHeight: 440,
  },
});

export default function StickyHeadTable() {

  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const columns = [
    {
      id: "sn",
      label: "S/N",
      minWidth: 10,
    },
    {
      id: "name",
      label: "Name",
      minWidth: 180,
      //    align: 'right',
    },
    {
      id: "email",
      label: "Email",
      minWidth: 100,
      // align: 'right',
      format: (value) => value.toLocaleString("en-US"),
    },
    {
      id: "amount",
      label: "Amount",
      minWidth: 120,
      // align: 'right',
      format: (value) => value.toLocaleString("en-US"),
    },
    {
      id: "date",
      label: "Date",
      minWidth: 100,
      // align: 'right',
      format: (value) => value.toFixed(2),
    },
    {
      id: "time",
      label: "Time",
      minWidth: 150,
      // align: 'right',
      format: (value) => value.toFixed(2),
    },
    {
      id: "status",
      label: "Status",
      minWidth: 150,
      // align: 'right',
      format: (value) => value.toFixed(2),
    },
   
  ];
  
  function createData(
    sn,
    name,
    email,
    amount,
    date,
    time,
    status
  ) {
    //   const density = population / size;
    return { sn, name, email, amount, date, time, status};
  }
  
  const rows = [
    createData(
      "2020-10-22",
      "Personal Loan",
      "Rent",
      "5%",
      "6 months",
      "NGN 50,000.00",
       "Paid"
    ),
    createData(
      "2020-10-22",
      "Personal Loan",
      "Rent",
      "5%",
      "6 months",
      "NGN 50,000.00",
       "Paid"
    ),  
  ];
  const [borrowerList, setBorrowerList] = useState([]);
  const [pagedBorrowerList, setPagedBorrowerList] = useState([]);
  const [ search, setSearch ] = useState('');
  const [ show, setShow ] = useState(1);
  const [ filtered, setFiltered ] = useState(false);

  const getBorrowerList = ()=>{
    Api().get('/loans')
    .then(function (response) {
      // handle success
      console.log(response.data.data);
      setBorrowerList(response.data.data)
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .then(function () {
      // always executed
    });
  
  }
  useEffect(() => {
    getBorrowerList()
  
  }, []);

  const paginateData = (dir) => {
    if (dir === 'down' && pagedBorrowerList[0] !== borrowerList[0]) {
      pagedBorrowerList(borrowerList.slice(show - 101, show - 1));
      setPage(show - 100);
    }

    if (dir === 'up' && pagedBorrowerList[pagedBorrowerList.length - 1] !== borrowerList[borrowerList.length -1]) {
      pagedBorrowerList(borrowerList.slice(show + 99, show + 199));
      setPage(show + 100);
    }
  }
  
  const filterData = (evt) => {
    evt.preventDefault();
    const fullName = search.split(' ');
    let allUsersData = [...borrowerList];
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

    setPagedBorrowerList(filteredUsersData);
    setFiltered(true);
  }

  const clearFilterData = () => {
    setPagedBorrowerList(pagedBorrowerList.slice(0, 100));
    setShow(1);
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
            show.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' - '
            + (pagedBorrowerList.indexOf(pagedBorrowerList[pagedBorrowerList.length - 1]) + show)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            + ' of ' + pagedBorrowerList.length.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
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
          <b>Format: "Surname FirstName OtherNames"<br/><i>E.g. type&nbsp;
            <font style={{color: '#000'}}>Smith</font> or&nbsp;
            <font style={{color: '#000'}}>Smith John</font> or&nbsp;
            <font style={{color: '#000'}}>Smith John James</font>.</i></b>
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
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === "number"
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
