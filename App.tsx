import React,{ FC, Fragment ,useState, useEffect }  from 'react';
import { Checkbox, FAB } from 'react-native-paper';
import  Icon  from "react-native-vector-icons/AntDesign";
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
  TouchableHighlight
 } from 'react-native';
 
 import todolist from './api/todolist.json';


 const storage: Storage = new Storage({
  // 最大容量
  size: 1000,
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
  description: string;
  done: boolean;
  check: boolean;
 }

 type Mode =`list` | `add`;

 const App:FC = () => {

  const [ready, setReady] = useState(false);
  const getReady = () => {
    setTodos(todolist);
    setReady(true);
  }
  useEffect(() => {
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
    if(!title || !description) return;

    const newTodo: Todo = {
      id: todos.length === 0 ? 1 : todos[todos.length - 1].id + 1,
      title,
      description,
      done: false,
      check: false
    }
    addTodo(newTodo);
    changeMode('list');

    storage.save({
      key: String(todos.length === 0 ? 1 : todos[todos.length - 1].id + 1),
      data: {
        id: todos.length === 0 ? 1 : todos[todos.length - 1].id + 1,
        title,
        description,
        done: false,
        check: false
      },
    });
  }

  let date : Date = new Date();

  storage.load({
    key: String(todos.length === 0 ? 1 : todos[todos.length - 1].id + 1),
  }).then((data: Date) => {
    // 読み出したdataをdateに入れる  
    date = data;
    // Date型のメソッドを使用
    //date.getTime();  // --> date.getTime is not a function...
    
    // Dateコンストラクタにdataを渡して新しいDateインスタンスを作成
    date = new Date(data);
    
    date.getTime(); // --> こうすることで正常に動作する
  }).catch((error) => {
    
  });


  // TODO入力フォーム初期値
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const resetInput = () => {
    setTitle('');
    setDescription('');
  }
  useEffect(() => {
    if(mode === 'list') {
      resetInput();
    }
  }, [mode]);

  // TODO削除
  const deleteTodo = (id: number) => {
    // filterメソッド: 配列の値を抽出するメソッド => [応用]選択されたIDが違うものだけを抽出するので同じIDを持つ内容は削除される
    setTodos(todos => todos.filter(todo => todo.id !== id))
  }
  const handleDelete = (id: number) =>{
    deleteTodo(id);
    storage.remove({
      key : String(id)
    });
  }
  
  // 描画部分
  return (
    <Fragment>
      <SafeAreaView style={styles.container}>

      <View style = {styles.todo_wrapper}>
        <View>
            <Text style={ styles.plus }>TODO LIST</Text>
         </View>

          <FlatList
            data={todos}
            renderItem={({ item: todo }) => {
              
              return (
                <View style={styles.todo_container}>
                  
                  <Text numberOfLines={5} style={styles.todo_title}>
                    { todo.title }{"\n"}{ todo.description }
                  </Text>
                  
                  <TouchableOpacity onPress={ () => handleDelete(todo.id) }>
                    <Icon name="delete" size={30} color='#1f1f1f'/>
                  </TouchableOpacity>
                </View>
              );
            }}
            keyExtractor={(_, index) => index.toString()}
          />
          
        </View>
        <FAB
          icon={'plus'}
          style={styles.fab}
          onPress={() => handlePlus()}
          />   


      <Modal visible={ mode === 'add'} animationType={ 'slide' }>
        <View style={ styles.modal }>
          <View style={ styles.textinput_frame }>
            <TextInput
              placeholder={'Title'}
              placeholderTextColor={'#bfbfbf'}
              value={ title }
              onChangeText={ text => setTitle(text) }
              style={ styles.textinput }
            />
            <TextInput
              placeholder={'Description'}
              placeholderTextColor={'#bfbfbf'}
              value={ description }
              onChangeText={ text => setDescription(text) }
              style={ styles.textinput }
            />
          </View>
          <View style={ styles.button }>
            <TouchableOpacity onPress={() => handleAdd()}>
              <Text style={ styles.add }>Add</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleCancel()}>
              <Text style={ styles.cancel }>Cancel</Text>
            </TouchableOpacity>
          </View>
          <View>


          </View>


        </View>
      </Modal>
      </SafeAreaView>
    </Fragment>
  );

}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
  
  container: {
    backgroundColor: "green",
    paddingBottom: 100,
  },
  modal: {
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: "#fff", 
    height: 400,
  },
  todo_wrapper: {
    marginTop: 0,
    backgroundColor: "red",
    height: windowHeight-30,
    width: windowWidth,
  },
  todo_container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    marginBottom: 3,
    paddingLeft: 15,
    backgroundColor: 'yellow',
    borderRadius: 10,
  },
  todo_title: {
    color: '#1f1f1f',
    width: windowWidth-90,
    paddingLeft: 5,
    paddingRight: 5,
    fontSize: 15,
    lineHeight: 20,
    textAlign: 'left',
  },
  checkbox: {

  },
  plus: {
    fontSize: 25,
    textAlign: 'center',
    color: '#4169e1',
    marginTop: 10,
    paddingLeft: 15,
  },
  add: {
    fontSize: 15,
    textAlign: 'center',
    color: '#fff',
    width: 250,
    marginTop: 20,
    marginRight: 5,
    padding: 10,
    backgroundColor: '#4169e1',
    borderRadius: 10,
  },
  cancel: {
    fontSize: 15,
    textAlign: 'center',
    color: '#fff',
    width: '100%',
    marginTop: 20,
    marginLeft: 5,
    padding: 10,
    backgroundColor: '#ccc',
    borderRadius: 10,
  },
  textinput_frame: {
    width: '100%',
    marginBottom: 25,
  },
  textinput: {
    color: '#1f1f1f',
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
    color: '#4169e1',
    position: 'absolute',
    marginTop: windowHeight-110,
    marginLeft: windowWidth-90,
    
  }

});

export default App;

