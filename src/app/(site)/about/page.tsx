import About from "@/components/About";
import Breadcrumb from "@/components/Common/Breadcrumb";
import Team from "@/components/Team";
import { Metadata } from "next";
import { generateClient } from "aws-amplify/api";
import { createTodo } from './graphql/mutations';
import { listTodos, getTodo } from "./graphql/queries";

const client = generateClient()

export const metadata: Metadata = {
  title:
    "About Us | Play SaaS Starter Kit and Boilerplate for Next.js",
  description: "This is About page description",
};

const AboutPage = () => {
  return (
    <main>
      <Breadcrumb pageName="About Us Page" />
      <About />
      <Team />
    </main>
  );
};


const newTodo = await client.graphql({
  query: createTodo,
  variables: {
      input: {
  "name": "Lorem ipsum dolor sit amet",
  "description": "Lorem ipsum dolor sit amet"
}
  }
});



// List all items
const allTodos = await client.graphql({
  query: listTodos
});
console.log(allTodo);



export default AboutPage;
