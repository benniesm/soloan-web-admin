import React from "react";
import Cards from "../Component/Cards";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import LoanTable from "../Component/LoansTable";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    marginTop: "1%",
    padding: theme.spacing(2),
    textAlign: "left",
    border: "1px solid #E3EBF6",
    boxSizing: "border-box",
    borderRadius: "10px",
  },
}));
export default function LoanReject(props) {
  const classes = useStyles();

  return (
    <>
    <Grid container spacing={3}>
        {/*<Grid item xs>
           <Cards color={"#007945"} name={"No of Reject Loan"} number={"40"}/>
        </Grid> */}
       
    </Grid>
    <p className="dashboardtitle"> Loan Reject </p>
     <Paper className={classes.paper}>
        <LoanTable url="/loans/by_status/reject?paginate=jjjkj" action={false} buttontext="approve" style={{padding: "1px"}}/>
      </Paper>
    </>
  );
}
