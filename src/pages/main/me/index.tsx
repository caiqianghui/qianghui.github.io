import { Component } from 'react'
import './index.scss'
import Taro from '@tarojs/taro';
import Users from './Users';
import NotData from 'src/components/NotData';

interface Props {
  user: any;
}

interface State {
  zohoUser: any;
}

class Index extends Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      zohoUser: undefined,
    }
  }

  componentWillMount () {
    this.getUser();
  }

  getUser = () => {
    const zohoUser = Taro.getStorageSync('currentUser');
    if (zohoUser) {
      this.setState({zohoUser});
    }
  }

  componentDidMount () {}

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    const {zohoUser} = this.state;
    return (
      zohoUser ? (
        <Users user={zohoUser}/>
      ) : (
        <NotData />
      )
    )
  }
}

export default Index;