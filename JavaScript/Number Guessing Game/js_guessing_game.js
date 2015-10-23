function  do_game()	{
   var  finished = false;
   var  target;
   var  random_num;
   var  guess_input;
   
   random_num = Math.random() * 100;	// should be random num between 0~99.999999
   target = Math.floor( random_num ) + 1;	// should be integer in range [1, 100]
   
   while ( !finished )	{
      guess_input = prompt ( "I am thinking of a number in the range 1 to 100.\n\nWhat is the number?" );
      finished = check_guess ( guess_input, target );
   }
}

function check_guess ( guess_input, target )	{
   var  guess_input_num = parseInt ( guess_input );
   
   if ( isNaN ( guess_input_num ) )	{
      alert ( "Enter a number!" );
      return false;
   }

   if ( guess_input_num < 1 || guess_input_num > 100 )	{
      alert ( "Wrong range!" );
      return false;    
   }

   if ( guess_input_num > target )	{
      alert ("Too high!");
      return false;
   }

   if ( guess_input_num < target )	{
      alert ("Too low!");
      return false;
   }

   alert ("You got it!");
   return true;

}



