import { Component } from 'react'
import './index.scss'
import Taro from '@tarojs/taro';
import Approval from './Approval';
import NotData from 'src/components/NotData';

interface State {
  cloudCurrentUser: any;
  isAdmin: boolean;
}

export default class Index extends Component<{}, State> {

  constructor(props: {}) {
    super(props);
    this.state = {
      cloudCurrentUser: undefined,
      isAdmin: false,
    }
  }

  getCloudCurrentUser = () => {
    const cloudCurrentUser = Taro.getStorageSync('cloudCurrentUser');
    let isAdmin = false;
    if (cloudCurrentUser && cloudCurrentUser.is_admin || cloudCurrentUser.profile_id && cloudCurrentUser.profile_id.name === '管理员') {
      isAdmin = true;
    }
    this.setState({cloudCurrentUser, isAdmin})

  }

  componentWillMount () {
    this.getCloudCurrentUser();
  }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <>
        <Approval />
      </>
    )
  }
}
