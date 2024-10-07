import React from 'react';
const Main = () => {
  return (
    <div className="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
      <ul className="nav nav-pills">
        <li role="presentation" className="active"><a href="#">Overview</a></li>
        <li role="presentation"><a href="#">Add Funds</a></li>
        <li role="presentation"><a href="#">Withdraw</a></li>
        <li role="presentation"><a href="#">History</a></li>
        <li role="presentation"><a href="#">Resolution Center</a></li>
        <li role="presentation"><a href="#">Profile</a></li>
      </ul>

      <div className="sub-header">
        <h2>Welcome, Bach Ly</h2>
        <span className="lnr lnr-checkmark-circle"></span>
        <span className="lnr lnr-tick"></span>
        Status: Verified | Account Type: Business
      </div>

      <ul className="nav nav-tabs">
        <li role="presentation" className="active"><a href="#">Home</a></li>
        <li role="presentation"><a href="#">Profile</a></li>
        <li role="presentation"><a href="#">Messages</a></li>
      </ul>

      <div className="btn-bar">
        <a className="btn btn-default" href="#" role="button">Link</a>
        <button className="btn btn-default" type="submit">Button</button>
        <input className="btn btn-default" type="button" value="Input" />
        <input className="btn btn-default" type="submit" value="Submit" />
      </div>

      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Name/Email</th>
              <th>Payment status</th>
              <th>Order status</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 15 }, (_, index) => (
              <tr key={index}>
                <td>{1000 + index}</td>
                <td>Lorem</td>
                <td>ipsum</td>
                <td>dolor</td>
                <td>sit</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Main;
