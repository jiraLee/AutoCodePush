/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Alert, AppState, StyleSheet, Text, View, Image } from 'react-native';
import codePush from 'react-native-code-push';

type Props = {};

export default class App extends Component<Props> {

  constructor(props) {
    super(props);
    this.state = {
      syncMessage: null,
      progress: null
    }
  }

  codePushSync() {
    try {
      codePush.sync(
        {
          installMode: codePush.InstallMode.IMMEDIATE
        },
        (syncStatus) => {
          switch(syncStatus) {
            case codePush.SyncStatus.CHECKING_FOR_UPDATE:
              this.setState({
                syncMessage: "Checking for update"
              });
              break;
            case codePush.SyncStatus.DOWNLOADING_PACKAGE:
              this.setState({
                syncMessage: "Downloading package"
              });
              break;
            case codePush.SyncStatus.AWAITING_USER_ACTION:
              this.setState({
                syncMessage: " Awaiting user action"
              });
              break;
            case codePush.SyncStatus.INSTALLING_UPDATE:
              this.setState({
                syncMessage: "App up to date",
                progress: false
              });
              break;
            case codePush.SyncStatus.UPDATE_IGNORED:
              this.setState({
                syncMessage: "Update cancelled by user.",
                progress: false
              });
              break;
            case codePush.SyncStatus.UPDATE_INSTALLED:
              this.setState({
                syncMessage: "Update installed and will be run when the app next resumes",
                progress: false
              })
              break;
            case codePush.SyncStatus.UNKNOWN_ERROR:
              this.setState({
                syncMessage: " AN unknown error occurred",
                progress: false
              });
              break;            
          }
        },
        (progress) => {
          this.setState({
            progress: progress
          });
        }
      );
    }
    catch (error) {
      Alert.alert('오류', '업데이트 과정에 오류가 발생했습니다.');
      codePush.log(error);
    }
  }

  componentDidMount() {
    this.codePushSync();
    AppState.addEventListener("change", (state) => {
      state == "active" && this.codePushSync();
    })
  }

  render() {
    
    if(!this.state.progress) {
      return null
    }
    
    let syncView, ProgressView;
    if(this.state.syncMessage) {
      syncView = (
        <View style={styles.titleWrap}>
          <Text style={styles.title}>{this.state.syncMessage}</Text>
        </View>
      ); 
    }

    progressView = (
      <View style={styles.percentWrap}> 
        <Text style={styles.percent}>{this.state.progress && parseInt((this.state.progress.reciveBytes/this.state.progress.totalBytes)*100)}%</Text>
      </View>
    )

    
    return (
      <View style={styles.container}>
        <Image
            style={{height:'30%',width:'30%',resizeMode:'contain'}}
            source={require('autoCodePush/image/002-instagram.png')}/>
        <Text style={styles.welcome}>Welcome to React Native!</Text>
        <Text style={styles.instructions}>To get started, edit App.js</Text>
        <syncView />
        <progressView />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  titleWrap: {
    marginTop : 10
  },
  title: {
    color: '#fff',
    fontSize: 16,
  },
  percentWrap: {
    width: 144,
    height: 30,
    borderRadius: 72,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center'
  },
  percent: {
    fontWeight: 'bold',
    fontSize: 20
  }
});
