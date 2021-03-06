import React from 'react'
import {connect} from 'react-redux'
import * as util from '../../lib/util.js'
import * as photoActions from '../../action/photo-actions.js'

import PhotoForm from '../photo-form'
import PhotoItem from '../photo-item'

class DashboardContainer extends React.Component {
  constructor(props){
    super(props)
  }

  componentDidMount(){
    console.log('HEELLO', this.props.photos);
    this.props.photosFetch(()=> {
      console.log('%%%%%%', photos);
    })
    .catch(util.logError)
  }

  render(){
    console.log('IN RENDER', this.props.photos);
    return (
      <div className='dashboard-container'>
        <h2>dashboard</h2>
        <PhotoForm
          buttonText='post'
          onComplete={(photo) =>{
            return this.props.photoCreate(photo)
            .catch(console.error)
          }}
          />
        {this.props.photos.map(photo =>
          <PhotoItem key={photo._id} photo={photo} />
        )}
      </div>
    )
  }
}

let mapStateToProps = (state) => ({
  profile: state.profile,
  photos: state.photos,
})

let mapDispatchToProps = (dispatch) => ({
  photoCreate: (photo) => dispatch(photoActions.photoCreateRequest(photo)),
  photosFetch: (photos) => dispatch(photoActions.photosFetchRequest()),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DashboardContainer)
