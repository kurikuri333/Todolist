import React,{ FC, Fragment ,useState, useEffect,Component }  from 'react';
import { AnimatedFAB, FAB, Checkbox } from 'react-native-paper';
import CheckboxList from 'rn-checkbox-list';
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
  Alert,
  TouchableHighlight
 } from 'react-native';

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

  //storageから現在の保存内容を読み込み
const listAll: any[] | ((prevState: Todo[]) => Todo[]) =[];

const listLoad = async () => {
await AsyncStorage.getAllKeys().then(allkeys =>{
for (var i = 1; i < allkeys.length ; i++){    
  storage.load({key: allkeys[i]}).then(data => {
  listAll.push(data);  
  setTodos(listAll);
})
}
})
}

  const [ready, setReady] = useState(false);
  const getReady = () => {
    //setTodos(listAll);
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
    if(!title || !description) return;

    const newTodo: Todo = {
      id: todos.length === 0 ? 1 : todos[todos.length - 1].id + 1,
      title,
      description,
      done: false,
      check: false
    }
    storage.save({
      key: 'key'+String(todos.length === 0 ? 1 : todos[todos.length - 1].id + 1),
      data: {
        id: todos.length === 0 ? 1 : todos[todos.length - 1].id + 1 ,
        title,
        description,
        done: false,
        check: false
      },
    });
    addTodo(newTodo);
    changeMode('list');

  }

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
      key : 'key'+String(id)
    });
  }

  
  const [checked, setChecked] = useState(false);

  const handleCheckbox = async (id: number) =>{

    await AsyncStorage.getAllKeys().then(allkeys =>{
      const indexNunber :number =allkeys.indexOf('key'+String(id));

      todos[indexNunber-1]['check'] = !todos[indexNunber-1]['check'] 

      console.log(todos[indexNunber-1]);
      console.log(todos);

      storage.save({
        key : 'key'+String(id),
        data: {
          id: todos[indexNunber-1]['id'],
          title: todos[indexNunber-1]['title'],
          description: todos[indexNunber-1]['description'],
          done: todos[indexNunber-1]['done'],
          check: todos[indexNunber-1]['check']
        },
      });
      // console.log(todos);
      //   storage.load({key: 'key'+String(id)}).then(nyan => {
      //     console.log(nyan);
      //   })
        setTodos(todos);
        setChecked(todos[indexNunber-1]['check']);
     })

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

                      <Checkbox
                            status={ todo.check ? 'checked' : 'unchecked'}
                            onPress={() => {
                              handleCheckbox(todo.id);
                            }}
                          />
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

