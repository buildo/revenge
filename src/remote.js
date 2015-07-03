import Avenger from 'avenger';

export default function remote(queries) {
  return recipe => {
    const av = new Avenger(queries, {});

    return av.querySetFromRecipe(recipe).run();
  };
}