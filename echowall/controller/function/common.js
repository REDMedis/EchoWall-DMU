/*
*	特殊的公共处理
*/

/*
*	将数组['1','2'] => "'1','2'"
*/
function arrayToString(array) {
	array[0] = '\'' + array[0] + '\'';
	return array.reduce((acc, item) => {
			return  acc + "," + '\'' + item + '\'';
			});
}

exports.arrayToString = arrayToString;