<template>
  <section class="todoapp">
    <!-- header -->
    <header class="header">
      <input class="new-todo" autocomplete="off" placeholder="待办事项" @keyup.enter="addTodo">
    </header>
    <!-- main section -->
    <section v-show="todos.length" class="main">
      <input id="toggle-all" :checked="allChecked" class="toggle-all" type="checkbox" @change="toggleAll({ done: !allChecked })">
      <label for="toggle-all" />
      <ul class="todo-list">
        <todo
          v-for="(todo, index) in filteredTodos"
          :key="index"
          :todo="todo"
          @toggleTodo="toggleTodo"
          @editTodo="editTodo"
          @deleteTodo="deleteTodo"
        />
      </ul>
    </section>
    <!-- footer -->
    <footer v-show="todos.length" class="footer">
      <span class="todo-count">
        <strong>{{ remaining }}</strong>
        {{ remaining | pluralize('item') }} left
      </span>
      <ul class="filters">
        <li v-for="(val, key) in filters" :key="key">
          <a :class="{ selected: visibility === key }" @click.prevent="visibility = key">{{ key | capitalize }}</a>
        </li>
      </ul>
      <!-- <button class="clear-completed" v-show="todos.length > remaining" @click="clearCompleted">
        Clear completed
      </button> -->
    </footer>
  </section>
</template>

<script>
import Todo from './Todo.vue'
import { getTodoList } from "@/api/dashboard"
import { todoEnums } from '@/utils/enum'

const STORAGE_KEY = 'todos'
// const defalutList = [
//   { text: 'star this repository', done: false },
//   { text: 'fork this repository', done: false },
//   { text: 'follow author', done: false },
//   { text: 'vue-element-admin', done: true },
//   { text: 'vue', done: true },
//   { text: 'element-ui', done: true },
//   { text: 'axios', done: true },
//   { text: 'webpack', done: true }
// ]
export default {
  components: { Todo },
  filters: {
    pluralize: (n, w) => n === 1 ? w : w + 's',
    capitalize: s => s.charAt(0).toUpperCase() + s.slice(1)
  },
  data() {
    return {
      visibility: 'all',
      filters:{},
      todos: [],
      filteredTodos:[]
    }
  },
  watch:{
    "visibility":{
      handler(newValue,oldValue){
        this.filteredTodos = this.filters[newValue](this.todos)
      }
    }
  },
  computed: {
    allChecked() {
      return this.todos.every(todo => todo.done)
    },
    remaining() {
      return this.todos.filter(todo => !todo.done).length
    }
  },
  mounted() {
    this.loadTodoList();
  },
  methods: {
    loadTodoList(){
      getTodoList().then((res) => {
        if(res.result){
          var todos= res.data;
          todos.forEach((todo, index) => {
            todo.done = todo.status== "20"   //已完成
          });
          this.todos=todos;
          this.filters= {
            all: todos => todos,
            active: todos => todos.filter(todo => !todo.done),
            completed: todos => todos.filter(todo => todo.done)
          }
          this.filteredTodos =res.data;
        }
      });
    },
    setLocalStorage() {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.todos))
    },
    addTodo(e) {
      const title = e.target.value
      if (title.trim()) {
        this.todos.push({
          title,
          done: false
        })
        this.setLocalStorage()
      }
      e.target.value = ''
    },
    toggleTodo(val) {
      val.done = !val.done
      this.setLocalStorage()
    },
    deleteTodo(todo) {
      this.todos.splice(this.todos.indexOf(todo), 1)
      this.setLocalStorage()
    },
    editTodo({ todo, value }) {
      todo.title = value
      this.setLocalStorage()
    },
    clearCompleted() {
      this.todos = this.todos.filter(todo => !todo.done)
      this.setLocalStorage()
    },
    toggleAll({ done }) {
      this.todos.forEach(todo => {
        todo.done = done
        this.setLocalStorage()
      })
    }
  }
}
</script>

<style lang="scss">
  @import './index.scss';
</style>
