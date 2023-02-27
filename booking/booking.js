const seats = {
  '2023-02-17': {
    '09:00': {
      format: '3D',
      foodFriendly: true,
      seats: new Array(30).fill(true)
    },
    '12:00': {
      format: '2D',
      foodFriendly: false,
      seats: new Array(50).fill(true)
    },
    '15:00': {
      format: '2D',
      foodFriendly: true,
      seats: new Array(70).fill(true)
    },
  },
  '2023-02-18': {
    '09:00': {
      format: '2D',
      foodFriendly: true,
      seats: new Array(50).fill(true)
    },
    '12:00': {
      format: '3D',
      foodFriendly: true,
      seats: new Array(50).fill(true)
    },
    '15:00': {
      format: '2D',
      foodFriendly: true,
      seats: new Array(50).fill(true)
    },
  },
  '2023-02-19': {
    '09:00': {
      format: '2D',
      foodFriendly: true,
      seats: new Array(50).fill(true)
    },
    '12:00': {
      format: '2D',
      foodFriendly: false,
      seats: new Array(50).fill(true)
    },
    '15:00': {
      format: '3D',
      foodFriendly: false,
      seats: new Array(50).fill(true)
    },
  },
}

function checkTicketsAvailable(date, time, numTicket, options) {
  const { format, foodFriendly, seats: seatsNum } = options
  return new Promise((resolve, reject)=> {
    setTimeout(() => {
      const show = seats[date][time]
      const seatsAvailable = show.seats.filter((seat) => seat === true).length;
      if(seatsAvailable >= numTicket){
        if (format && format !== show.format) {
          reject(`Сеанс ${date} о ${time} відсутній у ${format}`);
        }
        if (foodFriendly !== undefined && foodFriendly !== show.foodFriendly) {
          reject(foodFriendly ? 'Їжа не дозволена' : 'їжа дозволена')
        }
        if (seatsNum && !seatsNum.every((num) => num <= show.seats.length)) {
          reject(`Максимальна кількість місць у залі ${show.seats.length}`)
        }
        if (seatsNum && !seatsNum.every((num) => show.seats[num - 1])) {
          reject('Вказані місця зайняті')
        }
        if (seatsNum) {
          seatsNum.forEach((seat) => show.seats[seat - 1] = false )
        } else {
          for (let i = 0; i < numTicket; i++) {
            const freeIndex = show.seats.findIndex((seat) => seat ===  true);
            seats[freeIndex] = false;
          }
        }
        let message = `Ви забронювали квитки на сеанс ${date} о ${time}. `
        if (format) { message += `Формат ${format}. `}
        if (seatsNum !== undefined) { message += `Місця ${seatsNum} `}
        resolve(message)
      } else {
        reject(`Вільних місць на ${date} о ${time} немає`);
      }
    }, 1000);
  })
}


async function bookTickets(date, time, numTickets, options = {}) {
  try {
    return await checkTicketsAvailable(date, time, numTickets, options);
  } catch (error) {
    console.error(error);
  }
}

bookTickets('2023-02-17', '15:00', 2).then(console.log);
bookTickets('2023-02-17', '09:00', 3, {format: '2D', foodFriendly: true,
  seats: [17, 18]}).then(console.log)
bookTickets('2023-02-18', '09:00', 3, {format: '2D', foodFriendly: true,
  seats: [17, 18]}).then(console.log);
bookTickets('2023-02-19', '15:00', 2, {format: '3D', foodFriendly: false,
  seats: [25, 26]}).then(console.log);
bookTickets('2023-02-19', '15:00', 2, {format: '3D', foodFriendly: false,
  seats: [25, 26]}).then(console.log);
bookTickets('2023-02-19', '15:00', 2, {format: '2D', foodFriendly: false,
  seats: [28, 29]}).then(console.log);
bookTickets('2023-02-19', '15:00', 2, {format: '3D', foodFriendly: true,
  seats: [30, 31]}).then(console.log);
