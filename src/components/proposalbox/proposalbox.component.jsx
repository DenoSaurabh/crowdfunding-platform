import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import APIRequest from '../../utils/apirequest';

import './proposalbox.styles.scss';

import { ReactComponent as UpvoteBorderBlueSvg } from '../../assets/svg/upvote-border-blue.svg';
import { ReactComponent as ProposalMenu } from '../../assets/svg/proposal-menu.svg';
import { ReactComponent as CutSvg } from '../../assets/svg/cut.svg';

import { setCurrentError } from '../../redux/errorReducer/error.actions';
import { setProposalAcceptance } from '../../redux/UserUniversityReducer/university.action';

import Button from '../button/button.component';

class ProposalBox extends React.Component {
  state = { showArchivePopup: true };

  onProposalAcceptClick = async () => {
    console.log(this.props.universityId);

    const res = await new APIRequest(
      'post',
      `proposal/${this.props._id}/accept`,
      {
        universityId: this.props.universityId,
      }
    ).request();

    this.props.setProposalAcceptance(this.props._id, 'accept');
    console.log(res);
  };

  onProposalDeclineClick = async () => {
    const res = await new APIRequest(
      'post',
      `proposal/${this.props._id}/decline`,
      {
        universityId: this.props.universityId,
      }
    ).request();

    this.props.setProposalAcceptance(this.props._id, 'decline');
    console.log(res);
  };

  render() {
    return (
      <>
        <ProposalMenu
          onClick={() => this.setState({ showMenu: !this.state.showMenu })}
        />
        {this.state.showMenu ? (
          <div className="proposal-menu-content">
            <ul className="proposal-menu-content-ul">
              <li className="proposal-menu-content-ul__li --maintext --smallfont">
                Send Email
              </li>
              <li
                className="proposal-menu-content-ul__li --maintext --smallfont"
                onClick={() =>
                  this.setState({
                    showArchivePopup: !this.state.showArchivePopup,
                    showMenu: false,
                  })
                }
              >
                Archive
              </li>
            </ul>
          </div>
        ) : null}

        {this.state.showArchivePopup ? (
          <div className="archive-popup">
            <div className="archive-popup-content">
              <CutSvg
                onClick={() => this.setState({ showArchivePopup: false })}
              />
              <h4 className="--maintext"> Send Email to User </h4>
              <textarea
                type="text"
                className="archive-popup-content__textarea --maintext"
                placeholder="i.e. Hello we are from SMT University, we see your proposal and want to help more with like minded peoples."
              />
              <Button content="Send Email" colorStyle="blue" size="wide" />
            </div>
          </div>
        ) : null}

        <div
          className="proposal-box"
          onClick={() =>
            this.props.history.push(`/myuniversity/proposal/${this.props._id}`)
          }
        >
          <div className="proposal-box-header">
            <h4 className="proposal-box-header__title --maintext">
              {this.props.title}
            </h4>
          </div>
          <p className="proposal-box__description --subpara">
            {this.props.description.length > 300
              ? `${this.props.description.slice(0, 300)} ....`
              : this.props.description}
          </p>
          <div className="proposal-box-info">
            <span className="proposal-box-info__date --light --subpara">
              {`${new Date(this.props.uploadedOn).getDate()} ${
                [
                  'Jan',
                  'Feb',
                  'Mar',
                  'April',
                  'May',
                  'June',
                  'July',
                  'August',
                  'Sep',
                  'Oct',
                  'Nov',
                  'Dec',
                ][new Date(this.props.uploadedOn).getMonth()]
              } ${new Date(this.props.uploadedOn).getFullYear()}`}
            </span>
            <p className="proposal-box-info__upvotes --subpara">
              <UpvoteBorderBlueSvg /> {this.props.upvotes} upvotes
            </p>
            <p className="proposal-box-info__comments --subpara">
              {this.props.comments.length} comments
            </p>
          </div>
        </div>
        {!this.props.accepted ? (
          <div className="proposal-accepted">
            <p className="proposal-accepted-heading --maintext">
              This Proposal is not Accepted Yet!
            </p>
            <div className="proposal-accepted-buttons">
              <span
                className="proposal-accepted-buttons__accept --maintext --smallfont"
                onClick={this.onProposalAcceptClick}
              >
                Accept
              </span>
              <span
                className="proposal-accepted-buttons__decline --maintext --smallfont"
                onClick={this.onProposalDeclineClick}
              >
                Decline
              </span>
            </div>
          </div>
        ) : null}
      </>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  setCurrentError: (error) => dispatch(setCurrentError(error)),
  setProposalAcceptance: (proposalId, func) =>
    dispatch(setProposalAcceptance({ proposalId, func })),
});

export default withRouter(connect(null, mapDispatchToProps)(ProposalBox));
