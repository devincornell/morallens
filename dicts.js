



function convertRegex(str) {
    var nstr = str;
    nstr = nstr.replace('*','\\w*');
    nstr = nstr.replace(/\s+/,'\\ ');
    return nstr;
}

function parsedicttext(dtext) {
    lines = dtext.split('\n');
    var catcodemap = {};
    var wordcats = [];
    var dict = {}; // object version of wordcats
    var usedwords = [];
    var defmode = false;
    for (var i = 0; i < lines.length; i++) {
        var tl = lines[i].trim().split(/\s+/i);
        tl = tl.filter(function (w) { return w != '' })

        if (tl.length > 0 && tl[0] == '%') {
            defmode = !defmode;
        } else if (tl.length > 0) {
            if (defmode) {
                catcodemap[tl[0]] = tl.slice(1,tl.length).join(' ');
            } else {

                // search from right for first non-code entry
                var ind = null;
                for (var j = tl.length-1; j >= 0; j--) {
                    if (tl[j] in catcodemap) {
                        ind = j;
                    }
                }
                
                // give exception if none of the entries match codemap
                if (!(tl[tl.length-1] in catcodemap) || ind == null) {
                    console.log(lines[i])
                    console.log(tl)
                    throw('dictionary line ' + i.toString() + ' has undefined/no value: ' + lines[i]);
                }

                // properties of entry
                var wordkey = convertRegex(tl.slice(0,ind).join(' '));
                var catkeys = tl.slice(ind,tl.length)
                var catvalues = [];
                catkeys.forEach(function(ck) {
                    catvalues.push(catcodemap[ck]);
                });
                //print(wordkey)
                // Dict entries based on list of word,cats pairs
                var wordind = usedwords.indexOf(wordkey);
                if (wordind < 0) {
                    // make new entry for word with cats
                    var rawword = tl.slice(0,ind).join(' ');

                    var wordobj = {};
                    wordobj['word'] = wordkey;
                    wordobj['rawword'] = rawword;
                    wordobj['cats'] = catvalues;
                    usedwords.push(wordkey);
                    wordcats.push(wordobj);
                } else {
                    // entry already exists, just add catss
                    wordcats[wordind]['cats'] = wordcats[wordind]['cats'].concat(catvalues);
                }

                // Dict entries based on object (redundant to wordcats creation)
                if (!(wordkey in dict)) {
                    dict[wordkey] = [];
                }
                dict[wordkey] = dict[wordkey].concat(catvalues);
            }
        }
    }

    return {'dict':dict, 'codemap':catcodemap, 'wordcats':wordcats, 'usedwords':usedwords};
}




// for parsing dict (later should be in "on install" event handler)
/*
mfdurl = 'https://www.moralfoundations.org/sites/default/files/files/downloads/moral%20foundations%20dictionary.dic'
var xhr = new XMLHttpRequest();
xhr.open("GET", mfdurl, true);
xhr.onreadystatechange = function() {
  if (xhr.readyState == 4) {
    // JSON.parse does not evaluate the attacker's scripts.
    //var resp = JSON.parse(xhr.responseText);
    var dict = parsedicttext(xhr.responseText);
    chrome.storage.local.set({'dictionary': dict}, function() {
      //console.log('dict is set to ' + dict);
      console.log(dict)
      highlightPage(dict)
    });
  }
}
xhr.send();
*/



MFD2 = `
%
1	care.virtue
2	care.vice
3	fairness.virtue
4	fairness.vice
5	loyalty.virtue
6	loyalty.vice
7	authority.virtue
8	authority.vice
9	sanctity.virtue
10	sanctity.vice
%

compassion	1
empathy	1
kindness	1
caring	1
generosity	1
benevolence	1
altruism	1
compassionate	1
nurture	1
gentleness	1
nurturance	1
sympathy	1
nurturing	1
motherly	1
love	1
beneficence	1
empathize	1
helpfulness	1
loving	1
pity	1
mercy	1
nurturer	1
compassionately	1
nurturers	1
caringly	1
empathising	1
merciful	1
empathizing	1
nurtures	1
warmhearted	1
empathizers	1
protectiveness	1
nurtured	1
benevolent	1
mothering	1
cared	1
healing	1
empathises	1
humane	1
comfort	1
pitied	1
loved	1
altruist	1
cares	1
pitying	1
comforted	1
hug	1
comforting	1
consoling	1
empathizes	1
sympathize	1
care	1
caregiver	1
empathised	1
hugs	1
heal	1
generous	1
condolences	1
mothered	1
charitable	1
generously	1
pities	1
condolence	1
help	1
consolingly	1
solace	1
mother	1
healer	1
hospitality	1
charity	1
empathized	1
healers	1
pityingly	1
mothers	1
child	1
lovingly	1
parenting	1
rescuing	1
rescuer	1
loves	1
consoled	1
clothe	1
sympathizing	1
helping	1
shared	1
childhood	1
mommy	1
vulnerability	1
helpers	1
lover	1
hospitable	1
sharer	1
feeding	1
nursed	1
helper	1
safeness	1
nurses	1
protector	1
motherhood	1
alleviation	1
nursemaid	1
safeguard	1
protect	1
healthiness	1
protecters	1
patient	1
nurse	1
vulnerable	1
benefit	1
feed	1
childcare	1
rescuers	1
hugged	1
helpful	1
rescues	1
nursing	1
protecting	1
heals	1
childbearing	1
hugger	1
relief	1
healed	1
rescued	1
patients	1
share	1
rescue	1
healthy	1
hospitalise	1
hospitalising	1
hugging	1
nursery	1
healthier	1
sharing	1
helps	1
sympathizers	1
hospitalises	1
alleviating	1
wounded	1
wounds	1
hospitalize	1
alleviate	1
protective	1
protection	1
health	1
relieve	1
sympathizer	1
safety	1
beneficiary	1
helped	1
hospital	1
childbirth	1
benefits	1
healthcare	1
relievers	1
feeds	1
hospitalization	1
benefitting	1
relieving	1
safe	1
feeder	1
benefitted	1
hospitalized	1
unharmful	1
protects	1
unharmed	1
protecter	1
safely	1
safekeeping	1
hospitalizing	1
wounding	1
reliever	1
shares	1
relieves	1
alleviates	1
relieved	1
hospitalizes	1
console	1
protectorate	1
alleviated	1
protected	1
wound	1
consoles	1
harm	2
suffer	2
hurt	2
harmed	2
hurting	2
hurts	2
cruel	2
endanger	2
harming	2
harms	2
suffering	2
threaten	2
inflict	2
suffered	2
harmful	2
inflicted	2
mistreat	2
endangers	2
damaging	2
injurious	2
victimize	2
inflicts	2
hurtful	2
suffers	2
inflicting	2
injures	2
vulnerable	2
unkind	2
damage	2
kill	2
die	2
victimizes	2
torment	2
destroy	2
brutalise	2
brutalises	2
distresses	2
endangering	2
mistreats	2
afflict	2
distressing	2
destroys	2
victimises	2
maltreat	2
pain	2
harsh	2
mistreated	2
ravage	2
threatened	2
harass	2
unkindness	2
afflicted	2
threatens	2
threatening	2
distress	2
brutalize	2
tormenting	2
brutalized	2
victimizing	2
damager	2
damaged	2
bully	2
agony	2
abused	2
coldhearted	2
inhuman	2
injured	2
torments	2
brutalizes	2
uncompassionate	2
cruelty	2
tormented	2
mistreating	2
endangered	2
uncaring	2
anguishes	2
destroying	2
killed	2
mistreatment	2
bullied	2
harsher	2
cruelness	2
tortured	2
pained	2
tortures	2
torturing	2
maltreated	2
anguish	2
persecutes	2
maltreatment	2
brutalizing	2
attacked	2
victim	2
crying	2
damages	2
discomforting	2
abusing	2
threat	2
persecute	2
brutalization	2
violent	2
annihilated	2
torturous	2
harasses	2
injurer	2
destroyed	2
molests	2
molest	2
injuring	2
afflicts	2
killing	2
ache	2
wounded	2
persecuted	2
ravages	2
harassed	2
exploited	2
injury	2
brutalisation	2
discomfort	2
unmerciful	2
annihilate	2
exploiters	2
injurers	2
destruction	2
manhandle	2
kills	2
casualties	2
maltreating	2
victims	2
harassing	2
needier	2
smother	2
harassment	2
smothers	2
unhelpful	2
agonize	2
inhumanity	2
duress	2
victimization	2
exploiting	2
cried	2
wounds	2
wounding	2
murderous	2
ravaged	2
uncaringly	2
pains	2
painfulness	2
manhandles	2
bullies	2
assaulted	2
uncharitable	2
distressed	2
persecution	2
murdered	2
ravaging	2
discomforted	2
exploitation	2
torture	2
murderers	2
aches	2
afflictions	2
ungenerous	2
victimizer	2
agonizing	2
paining	2
persecuting	2
exploit	2
harassers	2
malevolent	2
stabs	2
sorrowful	2
assaults	2
needy	2
affliction	2
cries	2
fighting	2
fight	2
attack	2
annihilates	2
sorrow	2
agonized	2
assaulting	2
inhospitable	2
threats	2
ached	2
rapists	2
abuser	2
raped	2
assassinates	2
stabbed	2
inhospitality	2
annihilation	2
punch	2
harshness	2
abusers	2
killer	2
sufferers	2
victimizers	2
smite	2
killers	2
discomforts	2
fatalities	2
molested	2
brutality	2
murdering	2
torturer	2
torturers	2
fights	2
harmfulness	2
bullying	2
casualty	2
sufferer	2
exploiter	2
fatality	2
punches	2
abuses	2
attacks	2
vulnerability	2
carnage	2
tribulation	2
annihilator	2
smothering	2
bullyboy	2
murderer	2
wound	2
stabber	2
tormenters	2
malevolence	2
raping	2
smothered	2
assault	2
genocidal	2
anguishing	2
aching	2
anguished	2
stabbing	2
rapist	2
harasser	2
hungers	2
hunger	2
molesting	2
rape	2
molesters	2
punched	2
violence	2
distressingly	2
molester	2
stabbers	2
neediness	2
assassinate	2
agonizingly	2
tribulations	2
unhelpfulness	2
assaulter	2
puncher	2
punching	2
rapes	2
genocides	2
attackers	2
tormentor	2
assassinations	2
destroyers	2
punchers	2
sorrows	2
tormenter	2
threateningly	2
murder	2
destroyer	2
assassinating	2
crier	2
assassinated	2
molestation	2
attacker	2
murders	2
genocide	2
fighter	2
assassins	2
assaulters	2
hungering	2
achingly	2
hungered	2
murderess	2
assassin	2
exploits	2
fighters	2
assassination	2
equality	3
fairness	3
justice	3
rights	3
equitable	3
civil rights	3
fairplay	3
impartiality	3
equal	3
fairminded	3
proportionality	3
equalities	3
fair	3
integrity	3
impartial	3
reciprocity	3
honesty	3
egalitarian	3
civil right	3
law	3
justness	3
unbias	3
egalitarians	3
parity	3
objectiveness	3
reparations	3
unprejudiced	3
justices	3
laws	3
tribunals	3
retribution	3
reparation	3
lawfully	3
lawful	3
honest	3
compensation	3
lawyers	3
sportsmanship	3
tribunal	3
do unto others	3
golden rule	3
lawyer	3
proportional	3
equity	3
lawyering	3
trust	3
reciprocal	3
being objective	3
justification	3
trustworthiness	3
unbiased	3
vengeance	3
revenge	3
retributions	3
equals	3
equalize	3
refereeing	3
restitution	3
compensating	3
been objective	3
pay back	3
justified	3
justifies	3
retaliation	3
lawyered	3
compensated	3
referees	3
karma	3
will share	3
avenger	3
trusting	3
avengers	3
square deal	3
trusts	3
compensate	3
trustworthy	3
levels the playing field	3
tit for tat	3
retaliate	3
level the playing field	3
eye for an eye	3
square deals	3
repayment	3
payback	3
equities	3
justify	3
dues	3
square dealing	3
referee	3
repaid	3
square dealer	3
equalizer	3
due processes	3
level playing fields	3
repay	3
compensates	3
justifying	3
due processing	3
due process	3
repayments	3
repaying	3
level playing field	3
retaliating	3
square dealers	3
retaliated	3
refereed	3
revenger	3
avenging	3
repays	3
trusted	3
avenge	3
retaliates	3
equalizers	3
avenged	3
avenges	3
cheat	4
unfair	4
cheating	4
unfairness	4
injustice	4
fraud	4
dishonest	4
unjust	4
cheated	4
fraudulent	4
cheats	4
frauds	4
dishonesty	4
cheaters	4
deception	4
injustices	4
swindle	4
inequity	4
hypocrisy	4
discrimination	4
unequal	4
cheater	4
inequities	4
defraud	4
racism	4
scam	4
liar	4
defrauds	4
betrayal	4
deceipt	4
defrauded	4
inequality	4
liars	4
defrauders	4
hypocrite	4
biased	4
ripoffs	4
scams	4
fleecing	4
defrauder	4
discriminates	4
mislead	4
inequalities	4
prejudice	4
fleeced	4
defrauding	4
ripoff	4
scamming	4
imposters	4
exploitation	4
crooked	4
oppress	4
racist	4
oppression	4
imposter	4
swindled	4
hypocrites	4
plagiarism	4
lied	4
untrustworthiness	4
hoodwink	4
scammed	4
blackmail	4
bilks	4
swindling	4
betrayed	4
bias	4
connive	4
crooks	4
deceive	4
freeloaders	4
favoritism	4
disparity	4
swindles	4
deceived	4
exploiters	4
misleading	4
discriminated	4
bilked	4
deceiving	4
untrustworthy	4
prejudiced	4
false advertise	4
scammers	4
swindler	4
theft	4
duplicitous	4
hoodwinked	4
bigoted	4
sexism	4
disproportionate	4
swindlers	4
discriminate	4
conniving	4
sexist	4
betraying	4
hoodwinking	4
partiality	4
misleads	4
disproportion	4
economic disparity	4
exploiter	4
bilk	4
biases	4
bigots	4
distrust	4
dupe	4
crook	4
racists	4
con artist	4
bilking	4
blackmailing	4
deceives	4
betrayers	4
deceiver	4
blackmailed	4
duping	4
shyster	4
connivers	4
imbalanced	4
con artists	4
sexists	4
thieving	4
betray	4
imbalance	4
disproportions	4
disproportionately	4
freeloader	4
misleaders	4
connived	4
shysters	4
scammer	4
connives	4
conniver	4
disadvantaged	4
plagiaristic	4
moocher	4
dupes	4
discriminating	4
tricked	4
segregation	4
false advertised	4
thief	4
betrayer	4
bigot	4
exploiting	4
lying	4
thieves	4
stealing	4
suckered	4
deceivers	4
bamboozled	4
false advertisement	4
freeload	4
bamboozle	4
did rob	4
freeloading	4
steal	4
pickpocketing	4
blackmailer	4
prejudicing	4
chauvinists	4
exploit	4
misleader	4
hoodwinks	4
false advertiser	4
imbalances	4
pickpocketed	4
exploited	4
pickpockets	4
bamboozles	4
tricking	4
taking advantage	4
pickpocket	4
false advertisers	4
biasing	4
false impression	4
bamboozling	4
false witness	4
robs	4
moochers	4
betrays	4
robbing	4
false advertises	4
false impressions	4
blackmails	4
double cross	4
blackmailers	4
will rob	4
stolen	4
distrustful	4
false advertising	4
double crossers	4
mooches	4
disproportioned	4
mooching	4
segregated	4
double crosser	4
robbed	4
misleadingly	4
segregating	4
stole	4
double crosses	4
being partial	4
exploits	4
distrusts	4
mooch	4
segregate	4
robbers	4
distrusted	4
double crossing	4
distrusting	4
double crossed	4
be partial	4
go back on	4
stacking the deck	4
robber	4
segregates	4
ripping off	4
trickster	4
rips off	4
behind their backs	4
mooched	4
stacked the deck	4
was partial	4
am partial	4
stacked deck	4
stacks the deck	4
behind their back	4
been partial	4
free rider	4
ripped off	4
free riders	4
deceivingly	4
steals	4
unequaled	4
team player	5
player	5
patriot	5
loyal	5
loyalty	5
patriots	5
follower	5
fidelity	5
allegiance	5
ally	5
comrade	5
loyalties	5
death do us part	5
faction	5
comrades	5
allegiances	5
sacrifice	5
allies	5
organization	5
followers	5
us against them	5
sacrifices	5
all for one	5
comradery	5
one for all	5
fellow	5
family	5
allegiant	5
corps	5
unity	5
union jack	5
uniter	5
old glory	5
companions	5
country	5
companion	5
homeland	5
sacrificing	5
indivisible	5
sacrificed	5
solidarity	5
troops	5
nation	5
cult	5
kinship	5
companionship	5
clique	5
allied	5
community	5
group	5
factions	5
familiarity	5
solidarities	5
enlist	5
companionships	5
wife	5
united	5
belongs	5
congregation	5
brothers in arms	5
clan	5
trooper	5
sect	5
enlisted	5
enlistment	5
tribalism	5
cohorts	5
war	5
joining	5
troop	5
sacrificial	5
coalition	5
insider	5
pledge	5
cohort	5
enlisting	5
unite	5
communion	5
familiarities	5
belong	5
ingroup	5
belonged	5
company	5
collective	5
fellows	5
cliques	5
uniting	5
clans	5
hazing	5
congregates	5
herd	5
sects	5
uniters	5
undivided	5
unites	5
pledgers	5
coalitions	5
enlists	5
grouping	5
insiders	5
families	5
troupe	5
fellowship	5
kin	5
pledger	5
horde	5
nations	5
tribe	5
hordes	5
pledges	5
herder	5
commune	5
cults	5
congregations	5
organizations	5
herds	5
pledging	5
communities	5
familiar	5
hazings	5
belonging	5
pledged	5
bowed	5
collectively	5
together	5
groups	5
homelands	5
collectives	5
troopers	5
tribes	5
companies	5
countries	5
troupes	5
fellowships	5
tribal	5
communes	5
herders	5
grouped	5
herding	5
congregate	5
herded	5
congregating	5
traitor	6
disloyal	6
treason	6
traitors	6
betray	6
betraying	6
betrayer	6
betrayers	6
unpatriotic	6
betrayed	6
treachery	6
enemies	6
backstabber	6
backstabbed	6
heretic	6
enemy	6
betrays	6
deserter	6
infidels	6
infidel	6
backstab	6
deserting	6
apostate	6
heresy	6
backstabbers	6
heretics	6
unfaithful	6
rebellion	6
desertion	6
deserters	6
apostates	6
unfaithfulness	6
backstabbing	6
rebel	6
cheat on	6
treacherous	6
backstabs	6
heresies	6
outsider	6
outgroup	6
cheated on	6
against us	6
cheating on	6
rebels	6
infidelity	6
outgroups	6
rebellions	6
outsiders	6
cheats on	6
respect	7
obey	7
authority	7
obeyed	7
deference	7
reverence	7
respecting	7
obeying	7
tradition	7
adhere	7
obeys	7
revere	7
govern	7
comply	7
respectful	7
honor	7
adhered	7
allegiance	7
dictates	7
nobility	7
forbid	7
dominion	7
governed	7
obedient	7
reveres	7
adhering	7
governs	7
governing	7
oppress	7
respected	7
respectfully	7
honorable	7
dictate	7
commandments	7
commandment	7
venerate	7
politeness	7
respects	7
obedience	7
divine right	7
forbids	7
permission	7
veneration	7
hierarchy	7
forbade	7
honoring	7
proper	7
venerated	7
stature	7
acquiesce	7
adherence	7
deferential	7
leadership	7
punish	7
forbidding	7
revered	7
filial piety	7
patriarchs	7
decree	7
coerce	7
dominions	7
dictating	7
venerating	7
wear the crown	7
venerates	7
institution	7
monarchical	7
servant	7
decrees	7
permit	7
do as one says	7
supervise	7
duty	7
compliance	7
lionize	7
supervision	7
take orders	7
take up arms	7
duties	7
dictated	7
elders	7
emperors	7
commands	7
acquiesced	7
emperor	7
adheres	7
servants	7
regulations	7
covenant	7
hierarchical	7
subordinate	7
policing	7
decreeing	7
acquiesces	7
authorizing	7
nobles	7
permits	7
matriarchal	7
authorizes	7
control	7
command	7
subordinating	7
hierarchies	7
reverential	7
deferentially	7
punishes	7
patriarch	7
empires	7
honored	7
allegiant	7
protect	7
traditional	7
subordination	7
punished	7
noble	7
order	7
worship	7
social order	7
monarchs	7
ruling	7
lead by example	7
authorities	7
guiding	7
presidents	7
slavishly	7
patriarchy	7
subordinates	7
protection	7
supervisers	7
bow before	7
fathers	7
bow down	7
institutions	7
coersion	7
governors	7
commanded	7
police	7
authorize	7
bullys	7
bully	7
protecting	7
acquiescing	7
empire	7
mentor	7
chiefs	7
monarchies	7
honors	7
preside over	7
acquiescent	7
allegiances	7
bowing	7
oligarchy	7
willing	7
polite	7
supervising	7
pecking order	7
compliantly	7
bishops	7
monarch	7
slaves	7
traitors	7
punishments	7
authorized	7
protector	7
compliant	7
dutiful	7
father	7
punishment	7
coerces	7
toe the line	7
monarchy	7
obediently	7
elder	7
oligarchies	7
dictators	7
leaders	7
bishop	7
lorded over	7
worships	7
coercing	7
protectors	7
dictator	7
protected	7
punishing	7
traitor	7
commanding	7
coerced	7
commanders	7
pope	7
punitive	7
underlings	7
master	7
subordinated	7
president	7
in charge	7
matriarchy	7
lionizing	7
slave	7
chief	7
covenants	7
commander	7
matriarch	7
authorizer	7
guide	7
ordered	7
supervised	7
captains	7
punisher	7
supervises	7
bossing	7
commandant	7
governor	7
protects	7
admiral	7
top gun	7
bowed	7
dominate	7
arrest	7
mentored	7
ordering	7
submit	7
institutional	7
prime minister	7
lionizes	7
ranking	7
boss	7
captain	7
by the book	7
mentors	7
bullies	7
dominant	7
arrested	7
bossed	7
leader	7
rank	7
arresting	7
chieftain	7
prime ministers	7
regulation	7
superviser	7
dean	7
arrests	7
punishers	7
bullied	7
matriarchs	7
controlling	7
managerial	7
bosses	7
ranks	7
controls	7
dictation	7
guides	7
oligarchs	7
principals	7
top dog	7
admirals	7
caste	7
captaining	7
queen	7
mentoring	7
elderly	7
castes	7
governess	7
captained	7
principal	7
bullying	7
submission	7
dominated	7
corporate ladders	7
queens	7
underling	7
corporate ladder	7
fathered	7
dominates	7
dominating	7
presidential	7
oligarch	7
controlled	7
submits	7
submitting	7
head honcho	7
commandingly	7
vice president	7
slaving	7
fathering	7
slaved	7
managers	7
forbiddingly	7
controllers	7
submitted	7
ringleaders	7
ringleader	7
controller	7
ranked	7
manager	7
prime ministerial	7
submissions	7
ceo	7
punishingly	7
submitter	7
submitters	7
disrespect	8
disobey	8
disobedience	8
anarchy	8
chaos	8
subversion	8
subvert	8
lawlessness	8
subverting	8
disrespecting	8
sedition	8
treason	8
overthrow	8
insurrection	8
rebellion	8
transgress	8
treachery	8
dissent	8
dishonor	8
dissention	8
disrespects	8
bedlam	8
rebelling	8
misrule	8
transgression	8
insurrectional	8
pandemonium	8
mutiny	8
mutinies	8
misruling	8
disobedient	8
subverted	8
transgresses	8
transgressed	8
disarray	8
misruled	8
rioting	8
lawless	8
transgressing	8
illegality	8
overthrowing	8
dishonorable	8
dishonoring	8
rebelled	8
rebellions	8
riot	8
dishonouring	8
disrespected	8
permissiveness	8
refuser	8
unruly	8
subverts	8
unlawfulness	8
overthrown	8
anarchistic	8
dishonours	8
riots	8
refuse	8
chaotic	8
nonconformity	8
dissenters	8
uprising	8
insurrections	8
rioters	8
disordering	8
insubordinate	8
mutinied	8
insurrectionist	8
unlawful	8
nonconformists	8
heresy	8
uprisings	8
dishonors	8
tumult	8
overthrew	8
overthrows	8
rabble rousers	8
renegade	8
impolite	8
renegades	8
rabble rousing	8
dishonored	8
illegal	8
rioter	8
mutinous	8
disarrayed	8
apostates	8
dissidents	8
anarchists	8
raise hell	8
disorder	8
refusers	8
permissive	8
apostate	8
anarchist	8
treacherous	8
dissident	8
raises hell	8
disordered	8
heretic	8
overpower	8
rabble rouser	8
rebel	8
raising hell	8
heretics	8
unathorized	8
refusing	8
rebels	8
refuses	8
rioted	8
orders	8
dissenter	8
chaotically	8
nonconformist	8
heresies	8
illegals	8
unlawfully	8
heretical	8
dissents	8
traditions	8
dissenting	8
overpowers	8
trouble maker	8
refused	8
rock the boat	8
overpowering	8
tumultuous	8
overpowered	8
dissented	8
nonconforming	8
sanctity	9
sacred	9
sacredness	9
purity	9
wholesome	9
pureness	9
wholesomeness	9
holiness	9
dignity	9
godly	9
piety	9
sanctify	9
chastity	9
undefiled	9
holy	9
sacrosanct	9
pious	9
righteousness	9
dignities	9
sanctified	9
godliness	9
spirituality	9
chaste	9
sanctifies	9
righteous	9
divine	9
religious	9
biblical	9
spiritual	9
deity	9
sanctifying	9
noble	9
modesty	9
decency	9
scriptures	9
nobility	9
religion	9
hallow	9
soul	9
hallowed	9
deism	9
pristine	9
exalted	9
hallowing	9
eternal	9
holy cross	9
deities	9
faith	9
unadulterated	9
scripture	9
wholesomely	9
divinities	9
worship	9
virgin	9
god	9
catholicism	9
saintly	9
saintliness	9
godess	9
religiosity	9
purify	9
koranic	9
pure	9
holy crosses	9
exalt	9
virginity	9
divinity	9
consecrates	9
heaven	9
virginal	9
devout	9
dignified	9
tabernacle	9
exalts	9
buddhas	9
souls	9
temple	9
unsullied	9
heavenly	9
cleanliness	9
abstinance	9
spotlessness	9
talmudic	9
deists	9
gospels	9
prophets	9
religions	9
temples	9
buddhist	9
godesses	9
saints	9
temperance	9
celibacy	9
consecrated	9
priestly	9
bless	9
marriage	9
prophet	9
exalting	9
unchaste	9
supernatural	9
eternally	9
purification	9
apostles	9
monastic	9
purified	9
communion	9
gods	9
celibate	9
christians	9
theological	9
monasticism	9
unspoiled	9
sterility	9
christian	9
buddha	9
deist	9
prophetic	9
saint	9
righteously	9
apostle	9
prayer	9
faiths	9
shrine	9
purifying	9
worships	9
virgins	9
glorious	9
dignifies	9
atonement	9
deification	9
orthodoxy	9
hallows	9
enshrining	9
nunneries	9
church	9
religiously	9
blessings	9
consecrate	9
gospel	9
pray	9
beatifying	9
yogis	9
theology	9
purifies	9
orthodox	9
untainted	9
torah	9
faithfully	9
catholic	9
heavens	9
yogi	9
consecrating	9
blessed	9
faithful	9
koran	9
abstinence	9
jesus	9
monastery	9
purities	9
consecration	9
catholics	9
prayers	9
prayed	9
sterile	9
blesses	9
enshrined	9
torahs	9
organic	9
bible	9
glory	9
allah	9
glories	9
priests	9
dignifying	9
enshrine	9
mosques	9
spotlessly	9
prude	9
reverend	9
soulful	9
deify	9
christ	9
cathedrals	9
churches	9
cathedral	9
dignify	9
monasteries	9
raw	9
enshrines	9
refinement	9
nuns	9
monks	9
gloriously	9
almighty	9
marring	9
repent	9
prays	9
clean	9
orthodoxies	9
exterminates	9
rabbis	9
spotless	9
bibles	9
mosque	9
immaculate	9
organics	9
purifier	9
foods	9
lord	9
praying	9
repenting	9
marry	9
elevating	9
marrying	9
immaculately	9
rabbi	9
nunnery	9
priest	9
food	9
bloodiness	9
marries	9
synagogues	9
synagogue	9
refined	9
repents	9
angel	9
blessing	9
monk	9
rabbinical	9
organically	9
pope	9
nun	9
nobles	9
prophetically	9
blood	9
repented	9
pastor	9
purifiers	9
lords	9
bloody	9
untouched	9
cleaning	9
exterminating	9
exterminated	9
imam	9
higher power	9
cleaners	9
married	9
beatification	9
beatify	9
extermination	9
exterminate	9
cleaner	9
body	9
immune	9
atoning	9
imams	9
cleaned	9
atones	9
mary	9
refines	9
cleans	9
atone	9
immunities	9
immunity	9
stainless	9
refining	9
refine	9
atoned	9
exterminator	9
exterminators	9
impurity	10
degradation	10
depravity	10
desecrate	10
desecration	10
repulsiveness	10
degrading	10
decay	10
filth	10
depravities	10
defile	10
sin	10
fornication	10
repulsive	10
depraved	10
impiety	10
degrade	10
repugnance	10
impure	10
degraded	10
desecrations	10
sinfulness	10
impurities	10
indecencies	10
defiled	10
defiles	10
uncleanliness	10
damnation	10
debauchery	10
impious	10
sinful	10
necrophiliacs	10
desecrates	10
sleaziness	10
desecrating	10
desecrated	10
grossness	10
contaminates	10
sinning	10
promiscuity	10
befouls	10
rottenness	10
hedonism	10
revolting	10
repugnant	10
godless	10
scum	10
befoul	10
satanic	10
sluttiness	10
disgusting	10
pestilence	10
debased	10
trashiness	10
sins	10
degradingly	10
corrupting	10
deprave	10
perverted	10
debase	10
fornicating	10
degraders	10
defiling	10
slime	10
horrors	10
repugnantly	10
defiler	10
deviants	10
degrades	10
corrupts	10
debasing	10
perverts	10
parasitic	10
disgusts	10
deflowering	10
hedonistic	10
deviant	10
scummy	10
horrifying	10
necrophilia	10
contamination	10
rot	10
stain	10
contaminating	10
contaminants	10
dirtying	10
debases	10
contaminate	10
abhor	10
heresy	10
sleaze	10
staining	10
defilers	10
harlot	10
plagues	10
sullies	10
fornicators	10
vermin	10
befouling	10
incest	10
trashy	10
excreting	10
deforms	10
abhored	10
decayed	10
whores	10
deformities	10
perverse	10
adultery	10
fornicate	10
excrement	10
harlots	10
decaying	10
fornicator	10
unclean	10
nauseating	10
sully	10
heresies	10
satan	10
damns	10
satanically	10
sinned	10
sinners	10
adulterous	10
repulses	10
corruption	10
tainting	10
deformity	10
necrophiliac	10
decays	10
corrupted	10
deforming	10
contaminant	10
disgust	10
tarnishes	10
hell	10
filthy	10
taint	10
horrific	10
fecal	10
dirtied	10
flesh	10
stained	10
deform	10
putrid	10
scatalogical	10
dirties	10
whoring	10
cocksucker	10
plague	10
adulterers	10
excretes	10
infesting	10
slimy	10
excrete	10
scuzz	10
horror	10
tarnish	10
sexuality	10
parasite	10
obscenity	10
deformed	10
adulterer	10
befouled	10
muck	10
corpses	10
soiled	10
infest	10
incestuously	10
incestuous	10
fucker	10
devil	10
parasites	10
stains	10
skanks	10
corpse	10
whore	10
lepers	10
curses	10
corrupt	10
pathogens	10
diseased	10
deflower	10
hedonists	10
sinner	10
debaucherous	10
fester	10
hedonist	10
sleazy	10
fucks	10
promiscuous	10
cursed	10
curse	10
apostates	10
cocksuckers	10
heretic	10
lewdness	10
slutty	10
infests	10
festers	10
pervert	10
fuck	10
skanky	10
dirty	10
mucky	10
puke	10
alcoholism	10
feces	10
sullied	10
disgustingly	10
sexual	10
cunt	10
taints	10
profane	10
heretics	10
fucking	10
tarnishing	10
fornicated	10
mar	10
shitting	10
slut	10
obscene	10
barf	10
rotten	10
disgusted	10
cunts	10
waste	10
parasitically	10
sinfully	10
wastes	10
vomit	10
pathogen	10
rats	10
pathogenic	10
indecent	10
infect	10
leper	10
indecently	10
shit	10
abhors	10
skank	10
infestation	10
deflowered	10
leprosy	10
diseases	10
heretical	10
dirt	10
cursing	10
tarnishment	10
disease	10
prostitution	10
infested	10
apostate	10
sluts	10
fuckers	10
profanity	10
addiction	10
contaminated	10
scuzzy	10
infectiousness	10
indecency	10
vomitted	10
germ	10
prostituting	10
excreted	10
rubbish	10
fucked	10
sodomy	10
untouchables	10
epidemics	10
swear	10
shits	10
whorehouses	10
pigsty	10
germs	10
prostituted	10
mud	10
dung	10
epidemic	10
rat	10
douchebag	10
perversely	10
pukes	10
puking	10
prostitutes	10
barfs	10
slutting	10
trashing	10
whored	10
douchebags	10
infection	10
shite	10
spoil	10
gross	10
repulsed	10
pus	10
festering	10
cockroaches	10
tainted	10
contagion	10
barfed	10
infects	10
damned	10
addictions	10
shitty	10
skanking	10
trash	10
whorehouse	10
phlegm	10
moldy	10
plaguing	10
shat	10
drugged	10
garbage	10
infecting	10
pandemics	10
viruses	10
nauseated	10
cockroach	10
puked	10
drugging	10
manure	10
mucking	10
lewd	10
alcoholics	10
gangrenous	10
barfing	10
gangrene	10
shitter	10
shittier	10
tarnished	10
cock	10
vomits	10
hookers	10
damn	10
addict	10
alcoholic	10
nausea	10
swearing	10
vomitting	10
skanked	10
infections	10
foul	10
prostitute	10
risque	10
lice	10
gonorrhea	10
wasting	10
profanities	10
divorces	10
crappy	10
spreading	10
wasters	10
addicting	10
trashed	10
addicts	10
scabies	10
swore	10
nauseous	10
phlegmatically	10
spoiling	10
nauseatingly	10
drugs	10
virus	10
waster	10
untouchable	10
addicted	10
damning	10
pandemic	10
hooker	10
bm	10
infected	10
festered	10
marred	10
phlegmatic	10
divorce	10
viral	10
contagiously	10
plagued	10
repulsing	10
swears	10
drug	10
spoiled	10
cum	10
divorcing	10
wasted	10
divorced	10
contagious	10
`;



function getMFD2() {
	return parsedicttext(MFD2);
}

