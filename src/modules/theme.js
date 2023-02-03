const refs = {
  htmlBlock: document.documentElement,
  saveUserTheme: localStorage.getItem('user-theme'),
  input: document.querySelector('.page__theme'),
};

if (refs.saveUserTheme) {
  refs.htmlBlock.classList.add(refs.saveUserTheme);
}

if (refs.saveUserTheme === 'light') {
  refs.input.checked = false;
} else if (refs.saveUserTheme === 'dark') {
  refs.input.checked = true;
}

const changeTheme = function (saveTheme) {
  const currentTheme = refs.htmlBlock.classList.contains('light') ? 'light' : 'dark';
  let newTheme;

  if (currentTheme === 'light') {
    newTheme = 'dark';
  } else if (currentTheme === 'dark') {
    newTheme = 'light';
  }

  refs.htmlBlock.classList.remove(currentTheme);
  refs.htmlBlock.classList.add(newTheme);
  saveTheme && localStorage.setItem('user-theme', newTheme);
};

refs.input.addEventListener('click', () => {
  let saveTheme = true;
  changeTheme(saveTheme);
});
