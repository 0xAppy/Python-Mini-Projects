import random as rd
import time

def RPS():
    '''Here You Can Play Rock Paper Scissor'''
    options = ("rock", "paper", "scissor")
    com_choice = rd.choice(options)
    player_choice = input("Choose Your Weapon (Rock, Paper, Scissor) > ").lower()

    print("ROCK ")
    time.sleep(1)
    print("PAPER")
    time.sleep(1)
    print("SCISSOR")
    time.sleep(1)
    print("SHOOT!!")
    print(f"Computer Choice > {com_choice}")

    if player_choice == com_choice:
        return "tie"
    elif (player_choice == "rock" and com_choice == "scissor") or \
         (player_choice == "paper" and com_choice == "rock") or \
         (player_choice == "scissor" and com_choice == "paper"):
        return "win"
    else:
        return "lose"

while True:
    play_choice = input("Do You Want To Play Rock,Paper,Scissor (yes/no) = ").lower()

    if play_choice == "yes":
        try:
            rounds = int(input("Enter number of rounds you want to play: "))
        except ValueError:
            print("Please enter a valid number!")
            continue

        asterisks = '*' * 30
        result = f"{asterisks} Let's Play {asterisks}"
        print(result)
        print("LET THE SHOW BEGIN.....")
        
        player_score = 0
        computer_score = 0
        ties = 0

        for r in range(1, rounds + 1):
            print(f"\n--- ROUND {r}/{rounds} ---")
            print("Choose Your Weapon in...")
            print("3...2...1...")

            outcome = RPS()

            if outcome == "win":
                print("YOU WIN THIS ROUND!!!")
                player_score += 1
            elif outcome == "lose":
                print("YOU LOSE THIS ROUND!!!")
                computer_score += 1
            else:
                print("IT'S A TIE THIS ROUND!!!")
                ties += 1

            print(f"Score => You: {player_score} | Computer: {computer_score} | Ties: {ties}")

        print("\n" + "*" * 50)
        print("FINAL RESULT")
        print(f"YOU: {player_score} | COMPUTER: {computer_score} | TIES: {ties}")
        if player_score > computer_score:
            print("🎉 YOU ARE THE OVERALL WINNER!!! 🎉")
        elif computer_score > player_score:
            print("😢 COMPUTER WINS THE GAME 😢")
        else:
            print("🤝 IT'S AN OVERALL TIE 🤝")
        print("*" * 50)

    elif play_choice == "no":
        print("Exiting The Game.....")
        break

    else:
        print("Enter yes or no ")
print("THANK YOU FOR PLAYING!!!")
