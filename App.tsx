import React,{ FC, Fragment ,useState, useEffect,Component }  from 'react';
import { Checkbox } from 'react-native-paper';
import  Icon  from "react-native-vector-icons/AntDesign";
import  Icon2  from "react-native-vector-icons/FontAwesome5";
import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  StyleSheet, 
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  View, 
  FlatList, 
  Modal,
  Dimensions,
  Alert,
  TouchableHighlight
 } from 'react-native';

 const storage: Storage = new Storage({
  // 最大容量
  size: 9,
  // バックエンドにAsyncStorageを使う
  storageBackend: AsyncStorage,
  // キャッシュ期限(null=期限なし)
  defaultExpires: null,
  // メモリにキャッシュするかどうか
  enableCache: true,
});

 type Todo ={
  id: number;
  title: string;
  done: boolean;
  check: boolean;
}

type Mode =`list` | `add`;
const App:FC = () => {
  //storageから現在の保存内容を読み込み
const listAll: any[] | ((prevState: Todo[]) => Todo[]) =[];
const listLoad = async () => {
  await AsyncStorage.getAllKeys().then(allkeys =>{
  for (var i = 1; i < allkeys.length ; i++){    
    storage.load({key: allkeys[i]}).then(data => {
    listAll.push(data);  
    setTodos(listAll);
    console.log(allkeys)
  })
  }
})
}

const [ready, setReady] = useState(false);
  const getReady = () => {
    setReady(true);
  }
  useEffect (() => {
    listLoad();
    getReady();
  }, []);

  // モードチェンジ
  const [mode, setMode] = useState<Mode>('list');
  const changeMode = (mode: Mode) => {
    setMode(mode);
  }
  const handlePlus = () => {
    changeMode('add'); // modal表示
  }
  const handleCancel = () => {
    changeMode('list'); // リスト表示
  }

  // TODO追加
  const [todos, setTodos] = useState<Todo[]>([]);
  const addTodo = (todo: Todo) => {
    setTodos(todos => [...todos, todo]);
  }
  
  const handleAdd = () => {
    if(!title) return;
    // || !description
    const newTodo: Todo = {
      id: todos.length === 0 ? 1 : todos[todos.length - 1].id + 1,
      title,
      done: false,
      check: false
    }
    storage.save({
      key: ('key'+( '00000000' +String(todos.length === 0 ? 1 : todos[todos.length - 1].id + 1)).slice( -8 )),
      data: {
        id: todos.length === 0 ? 1 : todos[todos.length - 1].id + 1 ,
        title,
        done: false,
        check: false
      },
    });
    addTodo(newTodo);
    changeMode('list');
  }

  // TODO入力フォーム初期値
  const [title, setTitle] = useState('');
  const resetInput = () => {
    setTitle('');
  }
  useEffect(() => {
    if(mode === 'list') {
      resetInput();
    }
  }, [mode]);

  // TODO削除
  const showAlert = (id: number)=> {
    Alert.alert(
      '削除しますか',
      '',
      [
        {text: 'はい', onPress: () => handleDelete(id)},
        {text: 'いいえ', },
      ],
      { cancelable: false }
    )
  }
  
  const deleteTodo = (id: number) => {
    setTodos(todos => todos.filter(todo => todo.id !== id))
  }

  const handleDelete = (id: number) =>{
    deleteTodo(id);
    storage.remove({
      key : 'key'+( '00000000' + String(id) ).slice( -8 )
    });
  }

  const [checked, setChecked] = useState(false);
  const handleCheckbox = async (id: number) =>{
    await AsyncStorage.getAllKeys().then(allkeys =>{
      const keyIDs :string = 'key'+( '00000000' + String(id) ).slice( -8 );
      const indexNunber :number = allkeys.indexOf(keyIDs);
      todos[indexNunber-1]['check'] = !todos[indexNunber-1]['check'] ;
      storage.save({
        key : keyIDs,
        data: {
          id: todos[indexNunber-1]['id'],
          title: todos[indexNunber-1]['title'],
          done: todos[indexNunber-1]['done'],
          check: todos[indexNunber-1]['check']
        },
      });
        setTodos(todos);
        console.log(allkeys);
        console.log(todos);
        setChecked(!checked);
     })
  }
  
  // 描画部分
  return (
    <Fragment>
      <SafeAreaView style={styles.container}>
      <View style = {styles.todo_wrapper}>
        <View>
          {/* <Text style={ styles.titleBox }>----- Memo ist -----</Text> */}
        </View>
          <FlatList
            data={todos}
            renderItem={({ item: todo }) => {
              return (
                <View style={todo.check ? styles.todo_container_Push :styles.todo_container}>
                      <Checkbox
                        uncheckedColor = {'#fff'}
                        color={'#fff'}
                        status={ todo.check ? 'checked' : 'unchecked'}
                        onPress={() => {
                          handleCheckbox(todo.id);
                        }}
                      />
                  <Text numberOfLines={5} style={styles.todo_title}>
                    { todo.title }
                  </Text>
                   <TouchableOpacity onPress={ () => showAlert(todo.id) }>
                    <Icon name="delete" size={30} color='white'/>
                  </TouchableOpacity> 
                </View>
              );
            }}
            keyExtractor={(_, index) => index.toString()}
          />
          <TouchableOpacity onPress={ () => handlePlus() }>
          <View>
            <Text style={ styles.plus }>
              <Icon2 name="pen-nib" size={20} color='#1f1f1f'/>  New Memo</Text>
            

         </View>
         </TouchableOpacity> 
        </View>

        
        {/* <FAB
          icon = {"fountain-pen-tip"}
          color = {'#1f1f1f'}
          style={styles.fab}
          onPress={() => handlePlus()}
          />  */}

      <Modal visible={ mode === 'add'} animationType={ 'slide' } >
        <View style={ styles.modal }>
          <View style={ styles.textinput_frame }>
            <TextInput
              placeholder={'memo'}
              placeholderTextColor={'#bfbfbf'}
              value={ title }
              onChangeText={ text => setTitle(text) }
              style={ styles.textinput }
            />
          </View>
          <View style={ styles.button }>
            <TouchableOpacity onPress={() => handleAdd()}>
              <Text style={ styles.add }>+New Memo</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleCancel()}>
              <Text style={ styles.cancel }>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={ styles.modalBotum }></View>
      </Modal>
      </SafeAreaView>
    </Fragment>
  );
}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
  
  container: {
    backgroundColor: '#0B4C76',
    paddingBottom: 0,
    height: windowHeight,
  },
  modal: {
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#0B4C76', 
    height: 400,
  },
  modalBotum: {
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#0B4C76', 
    height: windowHeight-400,
  },
  todo_wrapper: {
    marginTop:5,
    paddingBottom: windowHeight*0.03,
    backgroundColor: '#0B4C76',
    height: windowHeight,
    // width: windowWidth,
  },
  todo_container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    marginLeft: 5,
    marginRight: 5,
    paddingLeft: 5,
    borderWidth: 0.7,
    backgroundColor: '#0B4C76',
    borderColor: "#fff",
    borderRadius: 10,    
  },
  todo_container_Push: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    marginLeft: 5,
    marginRight: 5,
    paddingLeft: 5,
    borderWidth: 0.7,
    backgroundColor: '#b33e5c',
    borderColor: "#fff",
    borderRadius: 10,    
  },
  todo_title: {
    color: '#FFFFFF',
    width: windowWidth-90,
    paddingLeft: 5,
    paddingRight: 5,
    fontSize: 17,
    lineHeight: 20,
    textAlign: 'left',
  },

  titleBox: {
    fontSize: 25,
    fontFamily: 'DancingScript-Bold',
    textAlign: 'center',
    color: '#fff',
    padding: 10,
    backgroundColor: '#0B4C76',
    borderColor: "#fff",
    marginLeft: 5,
    marginRight: 5,
    borderWidth: 0.7,
    borderRadius: 10,
    
  },

  plus: {
    fontSize: 25,
    fontFamily: 'DancingScript-Bold',
    textAlign: 'center',
    color: '#1f1f1f',
    padding: 10,
    // marginTop: 10,
    // marginBottom: 10,
    backgroundColor: '#fff',
    borderColor: "#fff",
    marginLeft: 5,
    marginRight: 5,
    borderWidth: 0.7,
    borderRadius: 10,
    
  },
  add: {
    fontSize: 18,
    fontFamily: 'DancingScript-Bold',
    textAlign: 'center',
    color: '#1f1f1f',
    width: 250,
    marginTop: 20,
    marginRight: 5,
    padding: 10,
    backgroundColor: '#fff',
    borderWidth: 0.7,
    borderColor: '#ccc',
    borderRadius: 10,
  },
  cancel: {
    fontSize: 18,
    fontFamily: 'DancingScript-Bold',
    textAlign: 'center',
    color: '#fff',
    width: '100%',
    marginTop: 20,
    marginLeft: 5,
    padding: 10,
    backgroundColor: '#0B4C76',
    borderWidth: 0.7,
    borderColor: '#ccc',
    borderRadius: 10,
  },
  textinput_frame: {
    width: '100%',
    marginBottom: 25,
  },
  textinput: {
    color: '#fff',
    fontSize: 18,
    borderColor: '#ccc',
    borderBottomWidth: 1,
    padding: 25,
  },
  button: {
    flexDirection: 'row',
  },
  delete: {
    fontSize: 14,
    padding: 30,
    color: '#fff',

  },
  fab: {
    backgroundColor: '#fff',
    position: 'absolute',
    marginTop: windowHeight-110,
    marginLeft: windowWidth-90,
    
  }

});

export default App;

