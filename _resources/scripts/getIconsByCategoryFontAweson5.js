//Emulate Click with delay
function emulateClick(btn) {
  return new Promise(resolve => {
    btn?.click();
    setTimeout(() => resolve(true), 1000);
  })
}

//Parse font aweson page and return names by catgeory
async function getIconsData() {
  iconsData = {}//Response
  categoryList = document.getElementsByClassName('list')//Get block categories
  items = categoryList[3].getElementsByTagName('li')//Get li tag from block categories

  for (const item of items) {
    itemCategoryName = item.getElementsByClassName('nowrap')
    categoryName = itemCategoryName[0].textContent
    const btn = item.getElementsByTagName('a')
    await emulateClick(btn[0])

    iconsData[categoryName] = []

    iconClass = ['fas', 'fab', 'far']
    iconClass.forEach(prefix => {
      icons = document.getElementsByClassName(prefix)
      for (const icon of icons) {
        iconsData[categoryName].push(icon.className)
      }
    })

    await emulateClick(btn[0])
    console.log('Get icons from category ' + categoryName)
  }

  copy(iconsData)
  console.log('Finished Get icons copied on clipboard')
}
