const HOTEL_IMAGES = [
  'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=200&fit=crop&q=80',
  'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400&h=200&fit=crop&q=80',
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=200&fit=crop&q=80',
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=200&fit=crop&q=80',
  'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400&h=200&fit=crop&q=80',
  'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400&h=200&fit=crop&q=80',
  'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=400&h=200&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?w=400&h=200&fit=crop&q=80',
  'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=400&h=200&fit=crop&q=80',
  'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=400&h=200&fit=crop&q=80',
  'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=400&h=200&fit=crop&q=80',
  'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=400&h=200&fit=crop&q=80',
  'https://images.unsplash.com/photo-1551882547-ff40c599fb6d?w=400&h=200&fit=crop&q=80',
  'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=200&fit=crop&q=80',
  'https://images.unsplash.com/photo-1455587734955-081b22074882?w=400&h=200&fit=crop&q=80',
  'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&h=200&fit=crop&q=80',
  'https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?w=400&h=200&fit=crop&q=80',
  'https://images.unsplash.com/photo-1529290130-4ca3753253ae?w=400&h=200&fit=crop&q=80',
  'https://images.unsplash.com/photo-1564501049412-61a470e46de8?w=400&h=200&fit=crop&q=80',
  'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=400&h=200&fit=crop&q=80',
  'https://images.unsplash.com/photo-1444201983204-c43cbd584d93?w=400&h=200&fit=crop&q=80',
  'https://images.unsplash.com/photo-1506059612708-99d6c258160e?w=400&h=200&fit=crop&q=80',
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=200&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519449556851-5720b33024e7?w=400&h=200&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517840901100-8179e982acb7?w=400&h=200&fit=crop&q=80',
  'https://images.unsplash.com/photo-1467987506553-8f3916508521?w=400&h=200&fit=crop&q=80',
  'https://images.unsplash.com/photo-1462826303086-329426d1aef5?w=400&h=200&fit=crop&q=80',
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=200&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=400&h=200&fit=crop&q=80',
  'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&h=200&fit=crop&q=80'
];

export function getHotelImage(listingName, index) {
  return HOTEL_IMAGES[index % HOTEL_IMAGES.length];
}
