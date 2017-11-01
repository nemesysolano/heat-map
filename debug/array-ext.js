export class ArrayEx {
    static rotate(array, reverse){

        if(reverse)
            array.unshift(array.pop())
        else
            array.push(array.shift())

        return array;
      } 
}

